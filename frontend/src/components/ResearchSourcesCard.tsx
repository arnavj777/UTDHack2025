import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ResearchSources } from '../types/MarketResearch.types';

interface ResearchSourcesCardProps {
  data: ResearchSources;
}

export function ResearchSourcesCard({ data }: ResearchSourcesCardProps) {
  return (
    <Card aria-label="Research Sources Section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">📚</span>
          Research Sources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Research */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Primary Research</h3>
          <div className="space-y-3">
            {data.primaryResearch.description && (
              <p className="text-sm text-slate-600">{data.primaryResearch.description}</p>
            )}
            {data.primaryResearch.methods.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Research Methods</h4>
                <ul className="space-y-2">
                  {data.primaryResearch.methods.map((method, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span aria-hidden="true">🔬</span>
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Secondary Research */}
        {data.secondaryResearch.sources.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Secondary Research</h3>
            <div className="space-y-3">
              {data.secondaryResearch.sources.map((source, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{source.type}</Badge>
                    <h4 className="font-semibold">{source.name}</h4>
                  </div>
                  {source.description && (
                    <p className="text-sm text-slate-600">{source.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}

