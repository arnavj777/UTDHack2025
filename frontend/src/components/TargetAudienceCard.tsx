import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TargetAudience } from '../types/MarketResearch.types';

interface TargetAudienceCardProps {
  data: TargetAudience;
}

export function TargetAudienceCard({ data }: TargetAudienceCardProps) {
  return (
    <Card aria-label="Target Audience Analysis Section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden="true">👥</span>
          Target Audience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demographics */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Age:</span>
              <span className="text-sm">{data.demographics.age}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Gender:</span>
              <span className="text-sm">{data.demographics.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Income:</span>
              <span className="text-sm">{data.demographics.income}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Education:</span>
              <span className="text-sm">{data.demographics.education}</span>
            </div>
            {data.demographics.occupation.length > 0 && (
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-slate-600">Occupation:</span>
                <span className="text-sm ml-2">{data.demographics.occupation.join(', ')}</span>
              </div>
            )}
          </div>
        </section>

        {/* Psychographics */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Psychographics</h3>
          <div className="space-y-4">
            {data.psychographics.interests.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {data.psychographics.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.psychographics.values.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Values</h4>
                <div className="flex flex-wrap gap-2">
                  {data.psychographics.values.map((value, index) => (
                    <Badge key={index} variant="secondary">{value}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.psychographics.motivations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Motivations</h4>
                <div className="flex flex-wrap gap-2">
                  {data.psychographics.motivations.map((motivation, index) => (
                    <Badge key={index} variant="secondary">{motivation}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.psychographics.lifestyle && (
              <div>
                <h4 className="text-sm font-medium mb-2">Lifestyle</h4>
                <p className="text-sm">{data.psychographics.lifestyle}</p>
              </div>
            )}
          </div>
        </section>

        {/* Behavioral Data */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Behavioral Data</h3>
          <div className="space-y-2">
            {data.behavioralData.purchaseHabits.length > 0 && (
              <div>
                <span className="text-sm font-medium text-slate-600">Purchase Habits:</span>
                <ul className="mt-1 space-y-1 list-disc list-inside ml-4">
                  {data.behavioralData.purchaseHabits.map((habit, index) => (
                    <li key={index} className="text-sm">{habit}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Usage Frequency:</span>
              <span className="text-sm">{data.behavioralData.usageFrequency}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Brand Loyalty:</span>
              <span className="text-sm">{data.behavioralData.brandLoyalty}</span>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        {data.painPoints.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Pain Points</h3>
            <ul className="space-y-2">
              {data.painPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span aria-hidden="true">⚠️</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Customer Segments */}
        {data.customerSegments.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Customer Segments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.customerSegments.map((segment, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                  <h4 className="font-semibold mb-1">{segment.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{segment.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Size:</span>
                    <span className="text-xs">{segment.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}

