import { ResearchData } from '../types/MarketResearch.types';
import { MarketOverviewCard } from './MarketOverviewCard';
import { TargetAudienceCard } from './TargetAudienceCard';
import { CompetitiveAnalysisCard } from './CompetitiveAnalysisCard';
import { MarketTrendsCard } from './MarketTrendsCard';
import { DemandAnalysisCard } from './DemandAnalysisCard';
import { ResearchSourcesCard } from './ResearchSourcesCard';
import { InsightsCard } from './InsightsCard';

interface MarketResearchDisplayProps {
  data: ResearchData | null;
}

export function MarketResearchDisplay({ data }: MarketResearchDisplayProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl mb-4" aria-hidden="true">📋</span>
        <h2 className="text-xl font-semibold mb-2">No Research Data Available</h2>
        <p className="text-slate-600">Generate a market research report to see insights here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.marketOverview && (
        <MarketOverviewCard data={data.marketOverview} />
      )}

      {data.targetAudience && (
        <TargetAudienceCard data={data.targetAudience} />
      )}

      {data.competitiveAnalysis && (
        <CompetitiveAnalysisCard data={data.competitiveAnalysis} />
      )}

      {data.marketTrends && (
        <MarketTrendsCard data={data.marketTrends} />
      )}

      {data.demandAnalysis && (
        <DemandAnalysisCard data={data.demandAnalysis} />
      )}

      {data.researchSources && (
        <ResearchSourcesCard data={data.researchSources} />
      )}

      {data.insights && (
        <InsightsCard data={data.insights} />
      )}
    </div>
  );
}

