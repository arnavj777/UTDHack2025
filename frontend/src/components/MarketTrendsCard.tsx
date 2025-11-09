import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MarketTrends } from '../types/MarketResearch.types';

interface MarketTrendsCardProps {
  data: MarketTrends;
}

export function MarketTrendsCard({ data }: MarketTrendsCardProps) {
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  return (
    <Card aria-label="Market Trends Section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">📈</span>
          Market Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emerging Trends */}
        {data.emergingTrends.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Emerging Trends</h3>
            <div className="space-y-3">
              {data.emergingTrends.map((trend, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{trend.name}</h4>
                    <Badge variant="outline" className={getImpactColor(trend.impact)}>
                      {trend.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{trend.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Unmet Needs */}
        {data.unmetNeeds.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Unmet Needs & Market Gaps</h3>
            <ul className="space-y-1 list-disc list-inside">
              {data.unmetNeeds.map((need, index) => (
                <li key={index} className="text-sm">{need}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Growth Drivers */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Growth Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.growthDrivers.technological.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span aria-hidden="true">💻</span>
                  Technological
                </h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.growthDrivers.technological.map((driver, index) => (
                    <li key={index}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.growthDrivers.social.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span aria-hidden="true">👥</span>
                  Social
                </h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.growthDrivers.social.map((driver, index) => (
                    <li key={index}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.growthDrivers.economic.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span aria-hidden="true">💰</span>
                  Economic
                </h4>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  {data.growthDrivers.economic.map((driver, index) => (
                    <li key={index}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Barriers to Entry */}
        {data.barriersToEntry.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Barriers to Entry</h3>
            <div className="space-y-3">
              {data.barriersToEntry.map((barrier, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{barrier.type}</h4>
                    <Badge variant="outline" className={getSeverityColor(barrier.severity)}>
                      {barrier.severity} severity
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{barrier.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}

