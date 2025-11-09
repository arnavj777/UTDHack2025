import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, TrendingUp, CheckCircle, AlertCircle, Play } from 'lucide-react';

export function ExperimentResultsViewer() {
  const experiments = [
    {
      name: 'New Onboarding Flow',
      status: 'completed',
      duration: '14 days',
      sampleSize: '10,000 users',
      startDate: '2025-10-15',
      endDate: '2025-10-29',
      winner: 'Variant B',
      confidence: 99,
      metrics: [
        { name: 'Completion Rate', control: '54%', variant: '77%', lift: '+42.6%', significant: true },
        { name: 'Time to Complete', control: '8.2 min', variant: '4.5 min', lift: '-45.1%', significant: true },
        { name: 'Day 7 Activation', control: '38%', variant: '41%', lift: '+7.9%', significant: false }
      ]
    },
    {
      name: 'Dark Mode Default',
      status: 'running',
      duration: '7 days (ongoing)',
      sampleSize: '5,000 users',
      startDate: '2025-11-04',
      endDate: 'TBD',
      winner: 'TBD',
      confidence: 67,
      metrics: [
        { name: 'Session Length', control: '7.8 min', variant: '8.9 min', lift: '+14.1%', significant: false },
        { name: 'Daily Sessions', control: '3.1', variant: '3.4', lift: '+9.7%', significant: false },
        { name: 'Satisfaction Score', control: '4.2', variant: '4.5', lift: '+7.1%', significant: false }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Experiment Results Viewer</h1>
          <p className="text-slate-600">A/B test results with AI interpretation and recommendations</p>
        </div>
        <Button className="gap-2">
          <Play className="w-4 h-4" />
          New Experiment
        </Button>
      </div>

      {/* Active Experiments Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Total Experiments</div>
          <div className="text-3xl">24</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Running</div>
          <div className="text-3xl text-blue-600">3</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Completed</div>
          <div className="text-3xl text-green-600">18</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Win Rate</div>
          <div className="text-3xl">67%</div>
        </Card>
      </div>

      {/* Experiment Cards */}
      <div className="space-y-6">
        {experiments.map((experiment, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="mb-2">{experiment.name}</h2>
                <div className="flex items-center gap-3 text-slate-600">
                  <span>{experiment.duration}</span>
                  <span>•</span>
                  <span>{experiment.sampleSize}</span>
                  {experiment.status === 'completed' && (
                    <>
                      <span>•</span>
                      <span>{experiment.startDate} to {experiment.endDate}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={experiment.status === 'completed' ? 'default' : 'secondary'}>
                  {experiment.status === 'completed' ? 'Completed' : 'Running'}
                </Badge>
                {experiment.status === 'completed' && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {experiment.confidence}% Confidence
                  </Badge>
                )}
              </div>
            </div>

            {/* AI Interpretation */}
            {experiment.status === 'completed' && (
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-2">AI Interpretation</h4>
                    <p className="text-slate-700 mb-3">
                      <strong>Clear winner: {experiment.winner}</strong> with statistical significance (p &lt; 0.01). 
                      The new onboarding flow dramatically improved completion rates and reduced time to value. 
                      The 42.6% lift in completion rate translates to approximately 4,260 additional activated users 
                      per month at current sign-up rates.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="default" className="gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Strong positive impact
                      </Badge>
                      <Badge variant="outline">Ship to 100%</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {experiment.status === 'running' && (
              <Card className="p-4 bg-yellow-50 border-yellow-200 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-2">Experiment Status</h4>
                    <p className="text-slate-700">
                      Early results show positive trends, but we need more data to reach statistical significance. 
                      Current confidence level: {experiment.confidence}%. Recommend running for at least 7 more days.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Results Table */}
            <Tabs defaultValue="results" className="space-y-4">
              <TabsList>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="segments">Segments</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-3">Metric</th>
                        <th className="text-left p-3">Control</th>
                        <th className="text-left p-3">Variant</th>
                        <th className="text-left p-3">Lift</th>
                        <th className="text-left p-3">Significance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experiment.metrics.map((metric, metricIndex) => (
                        <tr key={metricIndex} className="border-b last:border-0">
                          <td className="p-3">{metric.name}</td>
                          <td className="p-3">{metric.control}</td>
                          <td className="p-3 font-medium">{metric.variant}</td>
                          <td className="p-3">
                            <div className={`flex items-center gap-1 ${
                              metric.lift.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {metric.lift.startsWith('+') ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingUp className="w-4 h-4 rotate-180" />
                              )}
                              <span>{metric.lift}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            {metric.significant ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Significant
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not Yet</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="segments">
                <Card className="p-6 bg-slate-50">
                  <h4 className="mb-4">Segment Analysis</h4>
                  <div className="space-y-4">
                    {[
                      { segment: 'New Users (0-7 days)', lift: '+45%', performance: 'Strong positive' },
                      { segment: 'Power Users (>30 days)', lift: '+12%', performance: 'Slight positive' },
                      { segment: 'Mobile iOS', lift: '+48%', performance: 'Strong positive' },
                      { segment: 'Mobile Android', lift: '+38%', performance: 'Strong positive' }
                    ].map((seg, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded">
                        <span>{seg.segment}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600">{seg.lift}</span>
                          <Badge variant="outline">{seg.performance}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-slate-400">Timeline chart visualization</div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Recommendations */}
            {experiment.status === 'completed' && (
              <Card className="p-4 bg-green-50 border-green-200 mt-6">
                <h4 className="mb-3">Recommended Next Steps</h4>
                <div className="space-y-2">
                  {[
                    'Ship Variant B to 100% of users immediately',
                    'Update user documentation with new onboarding flow',
                    'Monitor completion rate for 7 days post-rollout',
                    'Consider running follow-up experiment on activation metrics'
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button>Ship to Production</Button>
                  <Button variant="outline">Schedule Rollout</Button>
                </div>
              </Card>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
