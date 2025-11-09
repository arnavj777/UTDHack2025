import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MarketOverview } from '../types/MarketResearch.types';

interface MarketOverviewCardProps {
  data: MarketOverview;
}

export function MarketOverviewCard({ data }: MarketOverviewCardProps) {
  return (
    <Card aria-label="Market Overview Section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">📊</span>
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Industry Description */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Industry Description</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Size:</span>
              <span className="text-sm">{data.industryDescription.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Maturity:</span>
              <Badge 
                variant="outline"
                className={
                  data.industryDescription.maturity === 'emerging' ? 'border-blue-500 text-blue-700' :
                  data.industryDescription.maturity === 'mature' ? 'border-green-500 text-green-700' :
                  'border-slate-500 text-slate-700'
                }
              >
                {data.industryDescription.maturity}
              </Badge>
            </div>
            {data.industryDescription.keyTrends.length > 0 && (
              <div>
                <span className="text-sm font-medium text-slate-600">Key Trends:</span>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {data.industryDescription.keyTrends.map((trend, index) => (
                    <li key={index} className="text-sm">{trend}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Market Size */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Market Size</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">TAM</div>
              <div className="text-xl font-bold mt-1">{data.marketSize.tam}</div>
              <div className="text-xs text-slate-500 mt-1">Total Addressable Market</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">SAM</div>
              <div className="text-xl font-bold mt-1">{data.marketSize.sam}</div>
              <div className="text-xs text-slate-500 mt-1">Serviceable Available Market</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">SOM</div>
              <div className="text-xl font-bold mt-1">{data.marketSize.som}</div>
              <div className="text-xs text-slate-500 mt-1">Serviceable Obtainable Market</div>
            </div>
          </div>
        </section>

        {/* Growth Rate */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Growth Rate</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">CAGR:</span>
              <span className="text-lg font-semibold text-blue-600">{data.growthRate.cagr}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">YoY Growth:</span>
              <span className="text-lg font-semibold text-blue-600">{data.growthRate.yoyGrowth}</span>
            </div>
          </div>
        </section>

        {/* Regulatory Factors */}
        {data.regulatoryFactors.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Regulatory Factors</h3>
            <ul className="space-y-1 list-disc list-inside">
              {data.regulatoryFactors.map((factor, index) => (
                <li key={index} className="text-sm">{factor}</li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
}

