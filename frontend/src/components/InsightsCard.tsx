import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Insights } from '../types/MarketResearch.types';

interface InsightsCardProps {
  data: Insights;
}

export function InsightsCard({ data }: InsightsCardProps) {
  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-100 text-red-700 border-red-300';
    if (priority <= 4) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  return (
    <Card aria-label="Insights and Recommendations Section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">💡</span>
          Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interpretation */}
        {data.interpretation.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Key Interpretations</h3>
            <ul className="space-y-1 list-disc list-inside text-sm">
              {data.interpretation.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Target Segments */}
        {data.targetSegments.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Priority Target Segments</h3>
            <div className="space-y-3">
              {data.targetSegments
                .sort((a, b) => a.priority - b.priority)
                .map((segment, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{segment.segment}</h4>
                      <Badge variant="outline" className={getPriorityColor(segment.priority)}>
                        Priority #{segment.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{segment.rationale}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Positioning Strategy */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Positioning Strategy</h3>
          <div className="space-y-3">
            <p className="text-sm">{data.positioning.strategy}</p>
            {data.positioning.differentiators.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Differentiators</h4>
                <div className="flex flex-wrap gap-2">
                  {data.positioning.differentiators.map((diff, index) => (
                    <Badge key={index} variant="secondary">{diff}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Risks */}
        {data.risks.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Risks & Gaps</h3>
            <ul className="space-y-2">
              {data.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span aria-hidden="true">⚠️</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Opportunities */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.opportunities.shortTerm.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span aria-hidden="true">🚀</span>
                  Short-Term
                </h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.opportunities.shortTerm.map((opp, index) => (
                    <li key={index}>{opp}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.opportunities.longTerm.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span aria-hidden="true">🎯</span>
                  Long-Term
                </h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.opportunities.longTerm.map((opp, index) => (
                    <li key={index}>{opp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

