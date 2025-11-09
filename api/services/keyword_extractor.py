"""
Keyword extraction service for extracting product/feature terms from text
"""
import re
import nltk
from typing import List, Set
import warnings
warnings.filterwarnings('ignore')

# Download NLTK data if not already downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag
from nltk.corpus import stopwords
from nltk.chunk import ne_chunk

# Try to import spaCy, fallback to NLTK if not available
SPACY_AVAILABLE = False
nlp = None

try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
        SPACY_AVAILABLE = True
    except OSError:
        # Model not downloaded, will use NLTK
        try:
            # Try to download model
            import subprocess
            import sys
            subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm", "--quiet"])
            nlp = spacy.load("en_core_web_sm")
            SPACY_AVAILABLE = True
        except:
            # If download fails, use NLTK
            SPACY_AVAILABLE = False
            nlp = None
except ImportError:
    SPACY_AVAILABLE = False
    nlp = None


class KeywordExtractor:
    """Service for extracting product/feature keywords from text"""
    
    def __init__(self):
        """Initialize the keyword extractor"""
        self.stop_words = set(stopwords.words('english'))
        # Add common non-product words to stop words
        self.stop_words.update(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
        
        # Product/feature related patterns
        self.product_patterns = [
            r'\b(feature|features|functionality|function|functions)\b',
            r'\b(button|buttons|menu|menus|panel|panels|screen|screens)\b',
            r'\b(api|apis|endpoint|endpoints|service|services)\b',
            r'\b(ui|ux|interface|interfaces|design|designs)\b',
            r'\b(component|components|module|modules|widget|widgets)\b',
            r'\b(dashboard|dashboards|page|pages|view|views)\b',
            r'\b(integration|integrations|plugin|plugins|extension|extensions)\b',
        ]
        
        # Technical terms that are likely product features
        self.technical_terms = [
            'authentication', 'authorization', 'encryption', 'security',
            'analytics', 'reporting', 'dashboard', 'metrics', 'logging',
            'notification', 'alert', 'reminder', 'email', 'sms',
            'payment', 'billing', 'subscription', 'invoice',
            'search', 'filter', 'sort', 'export', 'import',
            'sync', 'backup', 'restore', 'migration',
            'api', 'webhook', 'integration', 'connector'
        ]
    
    def extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """
        Extract product/feature keywords from text
        
        Args:
            text: Input text to extract keywords from
            max_keywords: Maximum number of keywords to return
        
        Returns:
            List of extracted keywords
        """
        if not text or not text.strip():
            return []
        
        keywords = set()
        
        # Use spaCy if available, otherwise use NLTK
        if SPACY_AVAILABLE and nlp is not None:
            keywords.update(self._extract_with_spacy(text))
        else:
            keywords.update(self._extract_with_nltk(text))
        
        # Filter and rank keywords
        filtered_keywords = self._filter_keywords(keywords, text)
        
        # Return top N keywords
        return list(filtered_keywords)[:max_keywords]
    
    def _extract_with_spacy(self, text: str) -> Set[str]:
        """Extract keywords using spaCy"""
        keywords = set()
        
        try:
            doc = nlp(text)
            
            # Extract named entities (PRODUCT, ORG, etc.)
            for ent in doc.ents:
                if ent.label_ in ['PRODUCT', 'ORG', 'TECH']:
                    keywords.add(ent.text.lower().strip())
            
            # Extract noun phrases
            for chunk in doc.noun_chunks:
                # Filter for product/feature related terms
                if self._is_product_related(chunk.text):
                    # Extract main noun
                    main_noun = chunk.root.text.lower().strip()
                    if len(main_noun) > 2 and main_noun not in self.stop_words:
                        keywords.add(main_noun)
            
            # Extract nouns and proper nouns
            for token in doc:
                if token.pos_ in ['NOUN', 'PROPN']:
                    if self._is_product_related(token.text):
                        keyword = token.lemma_.lower().strip()
                        if len(keyword) > 2 and keyword not in self.stop_words:
                            keywords.add(keyword)
        
        except Exception as e:
            # Fallback to NLTK if spaCy fails
            return self._extract_with_nltk(text)
        
        return keywords
    
    def _extract_with_nltk(self, text: str) -> Set[str]:
        """Extract keywords using NLTK"""
        keywords = set()
        
        try:
            # Tokenize and tag
            tokens = word_tokenize(text.lower())
            tagged = pos_tag(tokens)
            
            # Extract nouns and proper nouns
            for word, pos in tagged:
                if pos in ['NN', 'NNS', 'NNP', 'NNPS']:  # Nouns
                    if self._is_product_related(word):
                        if len(word) > 2 and word not in self.stop_words:
                            keywords.add(word)
            
            # Extract noun phrases (simple pattern matching)
            sentences = sent_tokenize(text)
            for sentence in sentences:
                tokens = word_tokenize(sentence.lower())
                tagged = pos_tag(tokens)
                
                # Look for noun phrases (adjective + noun, noun + noun)
                for i in range(len(tagged) - 1):
                    word1, pos1 = tagged[i]
                    word2, pos2 = tagged[i + 1]
                    
                    # Adjective + Noun
                    if pos1 in ['JJ', 'JJR', 'JJS'] and pos2 in ['NN', 'NNS']:
                        phrase = f"{word1} {word2}"
                        if self._is_product_related(phrase):
                            keywords.add(phrase)
                    
                    # Noun + Noun
                    if pos1 in ['NN', 'NNS'] and pos2 in ['NN', 'NNS']:
                        phrase = f"{word1} {word2}"
                        if self._is_product_related(phrase):
                            keywords.add(phrase)
        
        except Exception as e:
            # If NLTK fails, use simple regex extraction
            return self._extract_with_regex(text)
        
        return keywords
    
    def _extract_with_regex(self, text: str) -> Set[str]:
        """Fallback: Extract keywords using regex patterns"""
        keywords = set()
        
        # Match product/feature patterns
        for pattern in self.product_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            keywords.update([m.lower() for m in matches])
        
        # Extract capitalized words (likely product names)
        capitalized = re.findall(r'\b[A-Z][a-z]+\b', text)
        keywords.update([w.lower() for w in capitalized if len(w) > 2])
        
        return keywords
    
    def _is_product_related(self, text: str) -> bool:
        """
        Check if text is related to products/features
        
        Args:
            text: Text to check
        
        Returns:
            True if product-related
        """
        text_lower = text.lower()
        
        # Check against product patterns
        for pattern in self.product_patterns:
            if re.search(pattern, text_lower):
                return True
        
        # Check against technical terms
        for term in self.technical_terms:
            if term in text_lower:
                return True
        
        # Check for common product indicators
        product_indicators = ['feature', 'function', 'button', 'menu', 'api', 'ui', 'component', 'module']
        for indicator in product_indicators:
            if indicator in text_lower:
                return True
        
        return False
    
    def _filter_keywords(self, keywords: Set[str], original_text: str) -> List[str]:
        """
        Filter and rank keywords
        
        Args:
            keywords: Set of candidate keywords
            original_text: Original text for context
        
        Returns:
            Filtered and ranked list of keywords
        """
        filtered = []
        
        for keyword in keywords:
            # Skip if too short
            if len(keyword) < 3:
                continue
            
            # Skip if it's a stop word
            if keyword in self.stop_words:
                continue
            
            # Skip if it's mostly numbers or special characters
            if re.match(r'^[^a-zA-Z]+$', keyword):
                continue
            
            # Calculate importance score (simple: frequency in text)
            text_lower = original_text.lower()
            frequency = text_lower.count(keyword)
            
            # Boost score if it matches product patterns
            importance = frequency
            for pattern in self.product_patterns:
                if re.search(pattern, keyword):
                    importance += 2
            
            filtered.append((importance, keyword))
        
        # Sort by importance (descending)
        filtered.sort(key=lambda x: x[0], reverse=True)
        
        # Return just the keywords
        return [keyword for _, keyword in filtered]


# Singleton instance
_keyword_extractor = None

def get_keyword_extractor():
    """Get or create singleton instance of KeywordExtractor"""
    global _keyword_extractor
    if _keyword_extractor is None:
        _keyword_extractor = KeywordExtractor()
    return _keyword_extractor

