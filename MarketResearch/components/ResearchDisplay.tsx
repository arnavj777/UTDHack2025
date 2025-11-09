import React from 'react';
import { ResearchData } from '../types/research.types';
import MarketOverviewCard from './MarketOverviewCard';
import TargetAudienceCard from './TargetAudienceCard';
import CompetitiveAnalysisCard from './CompetitiveAnalysisCard';
import MarketTrendsCard from './MarketTrendsCard';
import DemandAnalysisCard from './DemandAnalysisCard';
import ResearchSourcesCard from './ResearchSourcesCard';
import InsightsCard from './InsightsCard';
import './ResearchDisplay.css';

interface ResearchDisplayProps {
  data: ResearchData | null;
}

const ResearchDisplay: React.FC<ResearchDisplayProps> = ({ data }) => {
  // Handle empty or null data state
  if (!data) {
    return (
      <div className="research-display empty">
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h2>No Research Data Available</h2>
          <p>Generate a market research report to see insights here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="research-display">
      <div className="research-container">
        {/* Market Overview */}
        {data.marketOverview && (
          <MarketOverviewCard data={data.marketOverview} />
        )}

        {/* Target Audience */}
        {data.targetAudience && (
          <TargetAudienceCard data={data.targetAudience} />
        )}

        {/* Competitive Analysis */}
        {data.competitiveAnalysis && (
          <CompetitiveAnalysisCard data={data.competitiveAnalysis} />
        )}

        {/* Market Trends */}
        {data.marketTrends && (
          <MarketTrendsCard data={data.marketTrends} />
        )}

        {/* Demand Analysis */}
        {data.demandAnalysis && (
          <DemandAnalysisCard data={data.demandAnalysis} />
        )}

        {/* Research Sources */}
        {data.researchSources && (
          <ResearchSourcesCard data={data.researchSources} />
        )}

        {/* Insights and Recommendations */}
        {data.insights && (
          <InsightsCard data={data.insights} />
        )}
      </div>
    </div>
  );
};

export default ResearchDisplay;
