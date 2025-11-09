import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CompetitiveAnalysis } from '../types/MarketResearch.types';
import { Building2, AlertCircle, TrendingUp, AlertTriangle, Target, ShieldAlert, DollarSign, Sparkles, Megaphone, BarChart3 } from 'lucide-react';

interface CompetitiveAnalysisCardProps {
  data: CompetitiveAnalysis;
}

// Helper function to clean text from markdown and formatting
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic *text*
    .replace(/__([^_]+)__/g, '$1') // Remove bold __text__
    .replace(/_([^_]+)_/g, '$1') // Remove italic _text_
    .replace(/^[-*•]\s+/, '') // Remove leading bullets
    .trim();
}

// Helper function to get badge color variant based on market position
function getPositionBadgeVariant(position: string): "default" | "secondary" | "outline" {
  const posLower = position.toLowerCase();
  if (posLower.includes('leader') || posLower.includes('dominant')) {
    return 'default';
  } else if (posLower.includes('growing') || posLower.includes('emerging')) {
    return 'secondary';
  }
  return 'outline';
}

// Helper function to extract percentage from market share string
function extractPercentage(share: string): number {
  const match = share.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}


export function CompetitiveAnalysisCard({ data }: CompetitiveAnalysisCardProps) {
  return (
    <Card aria-label="Competitive Analysis Section" className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BarChart3 className="h-6 w-6 text-primary" />
          Competitive Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Direct Competitors */}
        {data.directCompetitors.length > 0 && (() => {
          const validCompetitors = data.directCompetitors
            .map(competitor => ({
              name: cleanText(competitor.name),
              description: cleanText(competitor.description),
              position: cleanText(competitor.marketPosition),
            }))
            .filter(competitor => 
              competitor.name && 
              competitor.name !== 'N/A' && 
              competitor.name.length > 2 && 
              !competitor.name.toLowerCase().includes('no competitors')
            );
          
          if (validCompetitors.length === 0) return null;
          
          return (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">Direct Competitors</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validCompetitors.map((competitor, index) => {
                  // Ensure description is complete and self-contained
                  let description = competitor.description;
                  if (!description || description.length < 20) {
                    description = `${competitor.name} is a direct competitor in this market segment with established presence and market share.`;
                  }
                  
                  // Remove any leading bullets or formatting that might have been missed
                  description = description.replace(/^[-*•]\s+/, '').trim();
                  
                  return (
                    <div 
                      key={index} 
                      className="group relative p-5 bg-gradient-to-br from-blue-50 to-white rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 opacity-20 rounded-full -mr-16 -mt-16 group-hover:opacity-30 transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <Building2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <h4 className="font-bold text-lg text-slate-900">{competitor.name}</h4>
                          </div>
                          {competitor.position && competitor.position !== 'N/A' && competitor.position.length > 0 && (
                            <Badge 
                              variant={getPositionBadgeVariant(competitor.position)} 
                              className="text-xs shrink-0 whitespace-nowrap ml-2 bg-blue-100 text-blue-800 border-blue-300"
                            >
                              {competitor.position}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed flex-grow">
                          {description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Indirect Competitors */}
        {data.directCompetitors.length > 0 && data.indirectCompetitors.length > 0 && <Separator />}
        {data.indirectCompetitors.length > 0 && (() => {
          const validCompetitors = data.indirectCompetitors
            .map(competitor => ({
              name: cleanText(competitor.name),
              description: cleanText(competitor.description),
              position: cleanText(competitor.marketPosition),
            }))
            .filter(competitor => 
              competitor.name && 
              competitor.name !== 'N/A' && 
              competitor.name.length > 2 && 
              !competitor.name.toLowerCase().includes('no competitors')
            );
          
          if (validCompetitors.length === 0) return null;
          
          return (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-900">Indirect Competitors</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validCompetitors.map((competitor, index) => {
                  // Ensure description is complete and self-contained
                  let description = competitor.description;
                  if (!description || description.length < 20) {
                    description = `${competitor.name} serves as an indirect competitor, offering alternative solutions that address similar customer needs in this market.`;
                  }
                  
                  // Remove any leading bullets or formatting that might have been missed
                  description = description.replace(/^[-*•]\s+/, '').trim();
                  
                  return (
                    <div 
                      key={index} 
                      className="group relative p-5 bg-gradient-to-br from-purple-50 to-white rounded-lg border-l-4 border-purple-500 border-dashed shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 opacity-20 rounded-full -mr-16 -mt-16 group-hover:opacity-30 transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <AlertCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                            <h4 className="font-bold text-lg text-slate-900">{competitor.name}</h4>
                          </div>
                          {competitor.position && competitor.position !== 'N/A' && competitor.position.length > 0 && (
                            <Badge 
                              variant={getPositionBadgeVariant(competitor.position)} 
                              className="text-xs shrink-0 whitespace-nowrap ml-2 bg-purple-100 text-purple-800 border-purple-300"
                            >
                              {competitor.position}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed flex-grow">
                          {description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Market Share */}
        {((data.directCompetitors.length > 0 || data.indirectCompetitors.length > 0) && data.marketShare.length > 0) && <Separator />}
        {data.marketShare.length > 0 && (() => {
          const validShares = data.marketShare
            .map(share => ({
              competitor: cleanText(share.competitor),
              share: cleanText(share.share),
              percentage: extractPercentage(cleanText(share.share)),
            }))
            .filter(share => 
              share.competitor && 
              share.competitor !== 'N/A' && 
              share.competitor.length > 2
            )
            .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
          
          if (validShares.length === 0) return null;
          
          return (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xl font-bold text-slate-900">Market Share</h3>
              </div>
              <div className="space-y-3">
                {validShares.map((share, index) => {
                  return (
                    <div 
                      key={index} 
                      className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-slate-900">{share.competitor}</span>
                        <Badge 
                          variant={index < 3 ? 'default' : 'secondary'}
                          className={`${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-indigo-600' : index === 2 ? 'bg-purple-600' : ''} text-white border-0`}
                        >
                          {share.share}
                        </Badge>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${Math.min(share.percentage, 100)}%`,
                            backgroundColor: index === 0 ? 'rgb(37 99 235)' :
                                            index === 1 ? 'rgb(79 70 229)' :
                                            index === 2 ? 'rgb(147 51 234)' :
                                            'rgb(100 116 139)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* SWOT Analysis */}
        {data.marketShare.length > 0 && <Separator />}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">SWOT Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 shadow-sm hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-900">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Strengths
              </h4>
              {(() => {
                const items = data.swotAnalysis.strengths
                  .map(item => cleanText(item))
                  .filter(item => item && item !== 'N/A' && item.length > 3 && !item.toLowerCase().includes('market analysis in progress'));
                return items.length > 0 ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">Analysis in progress</p>
                );
              })()}
            </div>
            <div className="group p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-300 shadow-sm hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-900">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Weaknesses
              </h4>
              {(() => {
                const items = data.swotAnalysis.weaknesses
                  .map(item => cleanText(item))
                  .filter(item => item && item !== 'N/A' && item.length > 3 && !item.toLowerCase().includes('market analysis in progress'));
                return items.length > 0 ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">Analysis in progress</p>
                );
              })()}
            </div>
            <div className="group p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-900">
                <Target className="h-5 w-5 text-blue-600" />
                Opportunities
              </h4>
              {(() => {
                const items = data.swotAnalysis.opportunities
                  .map(item => cleanText(item))
                  .filter(item => item && item !== 'N/A' && item.length > 3 && !item.toLowerCase().includes('market analysis in progress'));
                return items.length > 0 ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">Analysis in progress</p>
                );
              })()}
            </div>
            <div className="group p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border-2 border-red-300 shadow-sm hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-900">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                Threats
              </h4>
              {(() => {
                const items = data.swotAnalysis.threats
                  .map(item => cleanText(item))
                  .filter(item => item && item !== 'N/A' && item.length > 3 && !item.toLowerCase().includes('market analysis in progress'));
                return items.length > 0 ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">Analysis in progress</p>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <Separator />
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Competitive Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(() => {
              const pricingItems = data.comparison.pricing
                .map(item => cleanText(item))
                .filter(item => item && item !== 'N/A' && item.length > 5 && !item.toLowerCase().includes('not available'));
              return pricingItems.length > 0 ? (
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-bold text-lg text-slate-900">Pricing</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {pricingItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}
            {(() => {
              const featureItems = data.comparison.features
                .map(item => cleanText(item))
                .filter(item => item && item !== 'N/A' && item.length > 5 && !item.toLowerCase().includes('not available'));
              return featureItems.length > 0 ? (
                <div className="p-5 bg-gradient-to-br from-violet-50 to-white rounded-lg border border-violet-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-violet-600" />
                    <h4 className="font-bold text-lg text-slate-900">Features</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {featureItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-violet-600 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}
            {(() => {
              const marketingItems = data.comparison.marketing
                .map(item => cleanText(item))
                .filter(item => item && item !== 'N/A' && item.length > 5 && !item.toLowerCase().includes('not available'));
              return marketingItems.length > 0 ? (
                <div className="p-5 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <Megaphone className="h-5 w-5 text-orange-600" />
                    <h4 className="font-bold text-lg text-slate-900">Marketing</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {marketingItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

