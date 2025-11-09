"""
Google Trends service using SerpAPI
"""
import os
import time
from typing import List, Dict, Optional
from django.conf import settings
from serpapi import GoogleSearch
import warnings
warnings.filterwarnings('ignore')


class TrendsService:
    """Service for fetching Google Trends data using SerpAPI"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the trends service
        
        Args:
            api_key: SerpAPI key. If None, loads from environment.
        """
        self.api_key = api_key or os.getenv('SERPAPI_KEY')
        if not self.api_key:
            raise ValueError("SERPAPI_KEY not found in environment variables")
        
        self.rate_limit_delay = 1  # Delay between requests (seconds)
        self.last_request_time = 0
    
    def get_trend_score(self, keyword: str, geo: str = "us", timeframe: str = "today 12-m") -> Optional[float]:
        """
        Get trend score for a single keyword
        
        Args:
            keyword: Keyword to search for
            geo: Geographic location (default: "us")
            timeframe: Time frame for trends (default: "today 12-m")
        
        Returns:
            Trend score (0-100) or None if error
        """
        try:
            # Rate limiting
            self._wait_for_rate_limit()
            
            # Search for trends using SerpAPI
            params = {
                "engine": "google_trends",
                "q": keyword,
                "geo": geo,
                "data_type": "TIMESERIES",
                "api_key": self.api_key
            }
            
            search = GoogleSearch(params)
            results = search.get_dict()
            
            # Extract trend data
            trend_score = self._extract_trend_score(results, keyword)
            
            return trend_score
        
        except Exception as e:
            print(f"Error fetching trends for '{keyword}': {e}")
            return None
    
    def get_trend_scores(self, keywords: List[str], geo: str = "us") -> Dict[str, float]:
        """
        Get trend scores for multiple keywords
        
        Args:
            keywords: List of keywords to search for
            geo: Geographic location (default: "us")
        
        Returns:
            Dictionary mapping keywords to trend scores (0-100)
        """
        trend_scores = {}
        
        for keyword in keywords:
            score = self.get_trend_score(keyword, geo)
            if score is not None:
                trend_scores[keyword] = score
            else:
                # Default score if API fails
                trend_scores[keyword] = 50.0
        
        return trend_scores
    
    def get_average_trend_score(self, keywords: List[str], geo: str = "us") -> float:
        """
        Get average trend score for multiple keywords
        
        Args:
            keywords: List of keywords
            geo: Geographic location (default: "us")
        
        Returns:
            Average trend score (0-100)
        """
        if not keywords:
            return 50.0  # Default score
        
        trend_scores = self.get_trend_scores(keywords, geo)
        
        if not trend_scores:
            return 50.0  # Default score
        
        # Calculate average
        avg_score = sum(trend_scores.values()) / len(trend_scores)
        
        return avg_score
    
    def _extract_trend_score(self, results: Dict, keyword: str) -> float:
        """
        Extract trend score from SerpAPI results
        
        Args:
            results: SerpAPI results dictionary
            keyword: Keyword that was searched
        
        Returns:
            Trend score (0-100)
        """
        try:
            # SerpAPI Google Trends returns data in different formats
            # Try to extract from interest_over_time or timeline_data
            if "interest_over_time" in results:
                data = results["interest_over_time"]
                if isinstance(data, list) and len(data) > 0:
                    # Get average of recent values
                    values = []
                    for item in data[-12:]:  # Last 12 data points
                        if "value" in item:
                            values.append(float(item["value"]))
                    
                    if values:
                        avg_value = sum(values) / len(values)
                        # Normalize to 0-100 (SerpAPI typically returns 0-100)
                        return min(100, max(0, avg_value))
            
            # Try alternative structure
            if "timeline_data" in results:
                data = results["timeline_data"]
                if isinstance(data, list) and len(data) > 0:
                    values = []
                    for item in data[-12:]:
                        if "values" in item and len(item["values"]) > 0:
                            values.append(float(item["values"][0].get("value", 0)))
                    
                    if values:
                        avg_value = sum(values) / len(values)
                        return min(100, max(0, avg_value))
            
            # Try default_timeline_data
            if "default_timeline_data" in results:
                data = results["default_timeline_data"]
                if isinstance(data, list) and len(data) > 0:
                    values = []
                    for item in data[-12:]:
                        if isinstance(item, dict) and "value" in item:
                            values.append(float(item["value"]))
                        elif isinstance(item, list) and len(item) > 0:
                            values.append(float(item[0]))
                    
                    if values:
                        avg_value = sum(values) / len(values)
                        return min(100, max(0, avg_value))
            
            # If no data found, return default score
            return 50.0
        
        except Exception as e:
            print(f"Error extracting trend score: {e}")
            return 50.0  # Default score
    
    def _wait_for_rate_limit(self):
        """Wait if needed to respect rate limits"""
        current_time = time.time()
        time_since_last_request = current_time - self.last_request_time
        
        if time_since_last_request < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - time_since_last_request)
        
        self.last_request_time = time.time()


# Singleton instance
_trends_service = None

def get_trends_service():
    """Get or create singleton instance of TrendsService"""
    global _trends_service
    if _trends_service is None:
        try:
            _trends_service = TrendsService()
        except ValueError:
            # API key not configured
            return None
    return _trends_service


# -----------------------------
# Fallback trend estimation
# -----------------------------

def estimate_trend_score_from_text(text: Optional[str], keywords: Optional[List[str]] = None) -> float:
    """
    Lightweight, dependency-free trend estimator used when SERPAPI is unavailable.
    Heuristic similar in spirit to the sentiment fallback:
      - Counts up-trend vs down-trend indicators in text
      - Maps ratio to 20–80 range
      - Adds a small boost for number of distinct keywords mentioned (breadth)
    """
    if not text and not keywords:
        return 50.0

    text_lower = (text or "").lower()

    up_terms = [
        'new', 'trending', 'rising', 'growing', 'increasing', 'surging',
        'popular', 'viral', 'hot', 'buzz', 'spike', 'demand', 'adoption',
        'launch', 'released', 'update', 'breakout', 'momentum'
    ]
    down_terms = [
        'decline', 'decreasing', 'dropping', 'falling', 'downtrend',
        'obsolete', 'legacy', 'outdated', 'stagnant', 'unpopular', 'saturated'
    ]

    up_count = sum(1 for k in up_terms if k in text_lower)
    down_count = sum(1 for k in down_terms if k in text_lower)

    if up_count == 0 and down_count == 0:
        base = 50.0
    else:
        ratio = up_count / (up_count + down_count)
        base = 20 + (ratio * 60)  # 20–80 scale similar to sentiment fallback

    # Breadth boost based on distinct keywords mentioned (0–10 points)
    kw_count = len(set((keywords or [])[:10]))
    boost = min(10.0, kw_count)  # simple cap

    return float(max(0.0, min(100.0, base + boost)))
