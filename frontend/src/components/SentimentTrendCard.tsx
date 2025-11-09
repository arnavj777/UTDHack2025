import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus, Sparkles, Hash } from 'lucide-react';

interface SentimentTrendCardProps {
  overallScore?: number;
  sentimentScore?: number;
  trendScore?: number;
  keywords?: string[];
  isLoading?: boolean;
}

export function SentimentTrendCard({
  overallScore,
  sentimentScore,
  trendScore,
  keywords = [],
  isLoading = false
}: SentimentTrendCardProps) {
  // Determine score color and label
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Positive';
    if (score >= 40) return 'Neutral';
    return 'Negative';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getBarColor = (score: number) => {
    if (score >= 70) return 'bg-green-600';
    if (score >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // Show card during loading or after first response (backend always returns scores)
  // Only hide if we're not loading and have no data at all
  if (!isLoading && overallScore === undefined && sentimentScore === undefined && trendScore === undefined && (!keywords || keywords.length === 0)) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg">Analysis Score</CardTitle>
          </div>
          {overallScore !== undefined && !isLoading && (
            <Badge 
              variant="outline" 
              className={`${getScoreBgColor(overallScore)} ${getScoreColor(overallScore)} border-current`}
            >
              {getScoreLabel(overallScore)}
            </Badge>
          )}
          {isLoading && (
            <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300">
              Analyzing...
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score - Show if available or loading */}
        {(overallScore !== undefined || isLoading) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Overall Score</span>
              {isLoading ? (
                <span className="text-2xl font-bold text-slate-400">...</span>
              ) : (
                <span className={`text-2xl font-bold ${getScoreColor(overallScore || 50)}`}>
                  {Math.round(overallScore || 50)}/100
                </span>
              )}
            </div>
            {!isLoading && overallScore !== undefined && (
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getBarColor(overallScore)}`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            )}
            {isLoading && (
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 animate-pulse" style={{ width: '50%' }} />
              </div>
            )}
          </div>
        )}

        {/* Sentiment and Trend Scores */}
        {(sentimentScore !== undefined || trendScore !== undefined || isLoading) && (
          <div className="grid grid-cols-2 gap-4">
            {/* Sentiment Score */}
            {(sentimentScore !== undefined || isLoading) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Sentiment</span>
                  {!isLoading && sentimentScore !== undefined && (
                    sentimentScore >= 50 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )
                  )}
                </div>
                {isLoading ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold text-slate-400">...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-semibold ${getScoreColor(sentimentScore || 50)}`}>
                        {Math.round(sentimentScore || 50)}
                      </span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                    {sentimentScore !== undefined && (
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(sentimentScore)}`}
                          style={{ width: `${sentimentScore}%` }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Trend Score */}
            {(trendScore !== undefined || isLoading) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Trend</span>
                  {!isLoading && trendScore !== undefined && (
                    trendScore >= 50 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )
                  )}
                </div>
                {isLoading ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold text-slate-400">...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-semibold ${getScoreColor(trendScore || 50)}`}>
                        {Math.round(trendScore || 50)}
                      </span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                    {trendScore !== undefined && (
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(trendScore)}`}
                          style={{ width: `${trendScore}%` }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-blue-200">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-600">Extracted Keywords</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.slice(0, 8).map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-white/60 hover:bg-white/80"
                >
                  {keyword}
                </Badge>
              ))}
              {keywords.length > 8 && (
                <Badge variant="secondary" className="text-xs bg-white/60">
                  +{keywords.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse text-sm text-slate-600">Analyzing sentiment and trends...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

