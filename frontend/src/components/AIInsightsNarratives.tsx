import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Download, RefreshCw } from 'lucide-react';

export function AIInsightsNarratives() {
  const narratives = [
    {
      title: 'Weekly Performance Summary',
      date: 'Week of Nov 4-10, 2025',
      type: 'weekly',
      summary: 'Strong growth week with biometric auth driving user engagement',
      insights: [
        {
          metric: 'User Growth',
          narrative: 'This week saw exceptional growth with 12,543 new sign-ups, representing a 28% increase over last week. The primary driver was the biometric authentication launch, which was mentioned in 47% of new user survey responses as a key reason for joining.',
          impact: 'High',
          recommendation: 'Double down on biometric auth messaging in marketing campaigns. Consider featuring it more prominently in app store listings.'
        },
        {
          metric: 'Engagement',
          narrative: 'Daily active users increased 15% week-over-week to 234K. Session length grew from 7.2 to 8.5 minutes, primarily due to users exploring the new dark mode feature and customizing settings.',
          impact: 'Medium',
          recommendation: 'Create in-app tutorials highlighting other personalization features to maintain this engagement momentum.'
        },
        {
          metric: 'Retention Challenge',
          narrative: 'D30 retention dipped slightly to 82% from 84% last week. Analysis shows this is concentrated among users who signed up 30-35 days ago, before the recent feature launches. These users may feel the product has evolved without them.',
          impact: 'Medium',
          recommendation: 'Launch a "What\'s New" email campaign targeting users from this cohort to re-engage them with recent improvements.'
        }
      ]
    }
  ];

  const rootCauseAnalysis = [
    {
      observation: 'Bill Split feature has low adoption (34%)',
      possibleCauses: [
        'Feature is buried in menu - poor discoverability',
        'Users don\'t understand the value proposition',
        'Onboarding doesn\'t showcase this feature',
        'Competitive features are more intuitive'
      ],
      dataPoints: [
        'Only 12% of users who see feature actually try it',
        'Average of 3.2 taps required to access vs 1.8 for top features',
        'User testing showed 60% couldn\'t find feature without prompting',
        'Venmo\'s split feature has 78% adoption among similar users'
      ],
      aiConclusion: 'Primary issue is discoverability and positioning. Feature quality is good (4.2★ from users who find it), but it\'s too hidden.',
      recommendedActions: [
        'Add prominent entry point on transaction detail screens',
        'Include in new user onboarding flow',
        'A/B test tooltip/banner promoting feature after large transactions',
        'Add to quick actions menu on home screen'
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">AI Insights & Narratives</h1>
          <p className="text-slate-600">AI-generated explanations and root cause analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Regenerate Insights
          </Button>
        </div>
      </div>

      {/* Quick AI Query */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-3">"Explain This Chart to Me"</h4>
            <p className="text-slate-700 mb-4">
              Click on any metric or chart in your dashboard and I'll provide context, trends, and actionable insights.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">Why did retention drop?</Button>
              <Button variant="outline" size="sm">What's driving revenue growth?</Button>
              <Button variant="outline" size="sm">Explain the engagement spike</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
          <TabsTrigger value="root-cause">Root Cause Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Weekly Reports */}
        <TabsContent value="weekly">
          {narratives.map((narrative, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="mb-2">{narrative.title}</h2>
                  <p className="text-slate-600">{narrative.date}</p>
                </div>
                <Badge variant="secondary">Auto-generated</Badge>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-1">Executive Summary</h4>
                    <p className="text-slate-700">{narrative.summary}</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                {narrative.insights.map((insight, insightIndex) => (
                  <div key={insightIndex}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3>{insight.metric}</h3>
                      <Badge variant={
                        insight.impact === 'High' ? 'destructive' :
                        insight.impact === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {insight.impact} Impact
                      </Badge>
                    </div>

                    <div className="prose max-w-none mb-4">
                      <p className="text-slate-700">{insight.narrative}</p>
                    </div>

                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="mb-1">AI Recommendation</h5>
                          <p className="text-slate-700">{insight.recommendation}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t flex gap-2">
                <Button variant="outline">Share Report</Button>
                <Button variant="outline">Schedule Weekly</Button>
                <Button variant="outline">Customize</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Root Cause Analysis */}
        <TabsContent value="root-cause">
          {rootCauseAnalysis.map((analysis, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h2>Root Cause Analysis</h2>
              </div>

              <Card className="p-4 bg-orange-50 border-orange-200 mb-6">
                <h4 className="mb-2">Observation</h4>
                <p className="text-slate-700">{analysis.observation}</p>
              </Card>

              <div className="mb-6">
                <h4 className="mb-3">Possible Causes</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {analysis.possibleCauses.map((cause, causeIndex) => (
                    <Card key={causeIndex} className="p-4 border-l-4 border-slate-300">
                      <p className="text-slate-700">{cause}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3">Supporting Data Points</h4>
                <div className="space-y-2">
                  {analysis.dataPoints.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                      <p className="text-slate-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-2">AI Conclusion</h4>
                    <p className="text-slate-700">{analysis.aiConclusion}</p>
                  </div>
                </div>
              </Card>

              <div>
                <h4 className="mb-3">Recommended Actions</h4>
                <div className="space-y-2">
                  {analysis.recommendedActions.map((action, actionIndex) => (
                    <Card key={actionIndex} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-green-700">{actionIndex + 1}</span>
                          </div>
                          <p className="text-slate-700 flex-1">{action}</p>
                        </div>
                        <Button variant="outline" size="sm">Create Task</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Predictions */}
        <TabsContent value="predictions">
          <Card className="p-6">
            <h3 className="mb-6">AI-Powered Predictions</h3>

            <div className="space-y-6">
              <Card className="p-6 bg-slate-50">
                <div className="flex items-start gap-4 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <h4 className="mb-2">Revenue Forecast (Next 30 Days)</h4>
                    <div className="text-3xl mb-2">$1.48M</div>
                    <p className="text-slate-600">Predicted MRR based on current trends</p>
                  </div>
                  <Badge variant="default">85% Confidence</Badge>
                </div>

                <div className="h-48 bg-white rounded-lg flex items-center justify-center mb-4">
                  <div className="text-slate-400">Revenue prediction chart</div>
                </div>

                <div className="text-slate-600">
                  <p className="mb-2"><strong>Key Factors:</strong></p>
                  <ul className="space-y-1">
                    <li>• Current growth rate: +18.3%/month</li>
                    <li>• Seasonal trend: Q4 typically +12% higher</li>
                    <li>• Feature impact: Biometric auth expected +$40K contribution</li>
                    <li>• Churn projection: 3.1% (slightly improved)</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6 bg-slate-50">
                <div className="flex items-start gap-4 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <div className="flex-1">
                    <h4 className="mb-2">Churn Risk Prediction</h4>
                    <div className="text-3xl mb-2">847 Users</div>
                    <p className="text-slate-600">At high risk of churning in next 14 days</p>
                  </div>
                  <Badge variant="secondary">78% Accuracy</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Risk Factors</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white rounded">
                        <span>Declining session frequency</span>
                        <Badge variant="destructive">High Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded">
                        <span>No feature usage in 7 days</span>
                        <Badge variant="secondary">Medium Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded">
                        <span>Negative support interaction</span>
                        <Badge variant="secondary">Medium Impact</Badge>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Launch Retention Campaign</Button>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
