import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DemandAnalysis } from '../types/MarketResearch.types';

interface DemandAnalysisCardProps {
  data: DemandAnalysis;
}

export function DemandAnalysisCard({ data }: DemandAnalysisCardProps) {
  const getReadinessIndicator = (score: string) => {
    const numericScore = parseFloat(score);
    if (!isNaN(numericScore)) {
      if (numericScore >= 8) return { color: 'bg-green-100 text-green-700 border-green-300', label: 'High' };
      if (numericScore >= 5) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'Medium' };
      return { color: 'bg-red-100 text-red-700 border-red-300', label: 'Low' };
    }
    const lowerScore = score.toLowerCase();
    if (lowerScore.includes('high') || lowerScore.includes('ready')) {
      return { color: 'bg-green-100 text-green-700 border-green-300', label: 'High' };
    }
    if (lowerScore.includes('medium') || lowerScore.includes('moderate')) {
      return { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'Medium' };
    }
    return { color: 'bg-red-100 text-red-700 border-red-300', label: 'Low' };
  };

  const readinessIndicator = getReadinessIndicator(data.marketReadiness.score);

  return (
    <Card aria-label="Demand Analysis Section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">📊</span>
          Demand Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Historical Demand */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Historical Demand</h3>
          <div className="space-y-4">
            {data.historicalDemand.trends.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Trends</h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.historicalDemand.trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.historicalDemand.seasonalEffects.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Seasonal Effects</h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.historicalDemand.seasonalEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Adoption Curve */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Adoption Curve</h3>
          <div className="p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-slate-600">Current Stage:</span>
              <span className="font-semibold">{data.adoptionCurve.currentStage}</span>
            </div>
            <p className="text-sm text-slate-600">{data.adoptionCurve.description}</p>
          </div>
        </section>

        {/* Market Readiness */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Market Readiness</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Readiness Score:</span>
              <Badge variant="outline" className={readinessIndicator.color}>
                {data.marketReadiness.score}
              </Badge>
              <Badge variant="outline" className={readinessIndicator.color}>
                {readinessIndicator.label}
              </Badge>
            </div>
            {data.marketReadiness.factors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Factors</h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.marketReadiness.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Elasticity */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Demand Elasticity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <span aria-hidden="true">💰</span>
                <h4 className="font-semibold">Price Elasticity</h4>
              </div>
              <p className="text-sm">{data.elasticity.priceElasticity}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <span aria-hidden="true">⚙️</span>
                <h4 className="font-semibold">Feature Elasticity</h4>
              </div>
              <p className="text-sm">{data.elasticity.featureElasticity}</p>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

