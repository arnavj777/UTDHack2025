import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, AlertTriangle, TrendingUp, TrendingDown, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export function PMDailyBriefing() {
  const topRisks = [
    {
      risk: 'Payment Gateway Integration running 2 weeks behind',
      severity: 'High',
      impact: 'Launch date at risk',
      action: 'Review scope with engineering lead'
    },
    {
      risk: 'Dark Mode adoption slower than expected (62% vs 80% target)',
      severity: 'Medium',
      impact: 'OKR miss likely',
      action: 'Increase in-app promotion'
    },
    {
      risk: 'Michael Torres over-allocated (13 pts vs 8 pt capacity)',
      severity: 'Medium',
      impact: 'Sprint delivery at risk',
      action: 'Redistribute work in next standup'
    }
  ];

  const velocityForecast = {
    current: 58,
    projected: 62,
    trend: 'up',
    confidence: 85
  };

  const sentimentChanges = [
    { topic: 'Biometric Auth', sentiment: 'Positive', change: '+12%', feedback: '234 mentions' },
    { topic: 'App Performance', sentiment: 'Negative', change: '-8%', feedback: '89 mentions' },
    { topic: 'Customer Support', sentiment: 'Positive', change: '+5%', feedback: '156 mentions' }
  ];

  const blockers = [
    {
      blocker: 'Waiting on API v3 from Plaid',
      owner: 'External',
      blockedItems: ['Investment Tracking', 'Advanced Analytics'],
      duration: '12 days'
    },
    {
      blocker: 'Security review pending for biometric feature',
      owner: 'Security Team',
      blockedItems: ['Biometric for Web'],
      duration: '5 days'
    }
  ];

  const updates = [
    { source: 'Slack #engineering', message: 'Dark mode PR merged and deployed to staging', time: '2h ago', type: 'success' },
    { source: 'Jira', message: '3 new critical bugs reported in payment flow', time: '4h ago', type: 'alert' },
    { source: 'Teams', message: 'Design team completed wireframes for Bill Split v2', time: '5h ago', type: 'info' },
    { source: 'Slack #customer-success', message: 'Customer renewal rate up 8% this month', time: '1d ago', type: 'success' }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Good morning, John 👋</h1>
          <p className="text-slate-600">Here's your AI-powered daily briefing for Saturday, November 8, 2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Customize Briefing</Button>
          <Button className="gap-2">
            <Sparkles className="w-4 h-4" />
            Ask AI
          </Button>
        </div>
      </div>

      {/* Top Risks */}
      <Card className="p-6 border-l-4 border-red-500">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2>Top 5 Risks Requiring Your Attention</h2>
        </div>

        <div className="space-y-3">
          {topRisks.map((risk, index) => (
            <Card key={index} className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={risk.severity === 'High' ? 'destructive' : 'secondary'}>
                      {risk.severity} Risk
                    </Badge>
                    <h4>{risk.risk}</h4>
                  </div>
                  <p className="text-slate-600 mb-2">Impact: {risk.impact}</p>
                  <p className="text-slate-700">→ Recommended: {risk.action}</p>
                </div>
                <Button variant="outline" size="sm">Take Action</Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Velocity Forecast */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h2>Velocity Forecast</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-slate-600 mb-1">Current Sprint</div>
            <div className="text-3xl">{velocityForecast.current} pts</div>
            <div className="text-slate-500">Committed</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-slate-600 mb-1">Projected Completion</div>
            <div className="text-3xl">{velocityForecast.projected} pts</div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+7% vs planned</span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-slate-600 mb-1">Team Confidence</div>
            <div className="text-3xl">{velocityForecast.confidence}%</div>
            <div className="text-slate-500">High confidence</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-slate-600 mb-1">At Risk Items</div>
            <div className="text-3xl">2</div>
            <div className="text-slate-500">Need attention</div>
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200 mt-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-slate-700">
              Team is trending 7% ahead of plan. Consider pulling in US-142 (5 pts) from next sprint to maintain momentum.
            </p>
          </div>
        </Card>
      </Card>

      {/* Sentiment Changes */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          <h2>Customer Sentiment Changes</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {sentimentChanges.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4>{item.topic}</h4>
                <Badge variant={item.sentiment === 'Positive' ? 'default' : 'destructive'}>
                  {item.sentiment}
                </Badge>
              </div>
              <div className={`flex items-center gap-1 mb-2 ${
                item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change.startsWith('+') ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{item.change} vs last week</span>
              </div>
              <div className="text-slate-500">{item.feedback}</div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Blockers */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2>Blockers Requiring Decisions</h2>
          <Badge variant="secondary">{blockers.length}</Badge>
        </div>

        <div className="space-y-3">
          {blockers.map((blocker, index) => (
            <Card key={index} className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <h4>{blocker.blocker}</h4>
                    <Badge variant="outline">Blocked {blocker.duration}</Badge>
                  </div>
                  <div className="text-slate-600 mb-2">Owner: {blocker.owner}</div>
                  <div>
                    <span className="text-slate-600">Blocking: </span>
                    {blocker.blockedItems.map((item, i) => (
                      <Badge key={i} variant="secondary" className="mr-2">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm">Escalate</Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Cross-Platform Updates */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          <h2>Latest Updates from Your Tools</h2>
        </div>

        <div className="space-y-2">
          {updates.map((update, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border rounded">
              {update.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />}
              {update.type === 'alert' && <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />}
              {update.type === 'info' && <MessageSquare className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{update.source}</Badge>
                  <span className="text-slate-500">{update.time}</span>
                </div>
                <p className="text-slate-700">{update.message}</p>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">View All Updates</Button>
      </Card>

      {/* AI Summary */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-3">AI Executive Summary</h4>
            <p className="text-slate-700 mb-4">
              Today's focus should be on addressing the Payment Gateway delay—this is your highest-risk item. 
              Otherwise, the team is performing well with velocity trending up. Customer sentiment on biometric 
              auth is overwhelmingly positive, which validates the prioritization decision. Consider addressing 
              the app performance feedback before it escalates. Overall: <strong>3 high-priority items, 2 quick wins available.</strong>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Dig Deeper</Button>
              <Button variant="outline" size="sm">Create Action Plan</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
