import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, TrendingDown, Sparkles, AlertTriangle, CheckCircle, 
  Clock, Target, Lightbulb, FileText, BarChart3, ArrowRight, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const initiatives = [
    { 
      name: 'Mobile App Redesign', 
      status: 'On Track', 
      progress: 75, 
      risk: 'low',
      dueDate: '2025-12-15',
      owner: 'Design Team'
    },
    { 
      name: 'Payment Gateway Integration', 
      status: 'At Risk', 
      progress: 45, 
      risk: 'high',
      dueDate: '2025-11-30',
      owner: 'Engineering'
    },
    { 
      name: 'Customer Portal v2', 
      status: 'On Track', 
      progress: 60, 
      risk: 'low',
      dueDate: '2025-12-20',
      owner: 'Product Team'
    }
  ];

  const aiInsights = [
    {
      type: 'warning',
      title: 'Payment Gateway Integration behind schedule',
      description: 'Sprint velocity down 30%. Consider descoping non-critical features.',
      action: 'View Sprint'
    },
    {
      type: 'success',
      title: 'High customer demand detected for dark mode',
      description: '47 feedback mentions this week. AI suggests prioritizing this feature.',
      action: 'See Feedback'
    },
    {
      type: 'info',
      title: 'Competitor launched similar feature',
      description: 'FinanceApp released biometric authentication. Review our roadmap.',
      action: 'View Analysis'
    }
  ];

  const kpis = [
    { label: 'Active Initiatives', value: '12', change: '+3', trend: 'up' },
    { label: 'Sprint Health', value: '87%', change: '+5%', trend: 'up' },
    { label: 'Backlog Items', value: '143', change: '-12', trend: 'down' },
    { label: 'Customer NPS', value: '72', change: '+4', trend: 'up' }
  ];

  const quickActions = [
    { icon: Lightbulb, label: 'Create Idea', color: 'text-yellow-600 bg-yellow-50', path: '/workspace/ideas' },
    { icon: FileText, label: 'Generate PRD', color: 'text-blue-600 bg-blue-50', path: '/workspace/prd' },
    { icon: BarChart3, label: 'Market Analysis', color: 'text-purple-600 bg-purple-50', path: '/workspace/market-sizing' },
    { icon: Target, label: 'Update Strategy', color: 'text-green-600 bg-green-50', path: '/workspace/strategy' }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Welcome back, John 👋</h1>
          <p className="text-slate-600">Here's what's happening with your products today</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="w-4 h-4" />
          Ask AI Assistant
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-600">{kpi.label}</span>
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-3xl mb-1">{kpi.value}</div>
            <div className={`flex items-center gap-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <span>{kpi.change}</span>
              <span className="text-slate-500">vs last week</span>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3>AI-Generated Insights</h3>
            <Badge variant="secondary">3 New</Badge>
          </div>
          <Button variant="ghost">View All</Button>
        </div>
        
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                insight.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                insight.type === 'success' ? 'bg-green-50 border-green-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />}
                  {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />}
                  {insight.type === 'info' && <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <h4 className="mb-1">{insight.title}</h4>
                    <p className="text-slate-600">{insight.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 shrink-0">
                  {insight.action} <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Initiatives */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Active Initiatives</h3>
              <Link to="/workspace/roadmap">
                <Button variant="ghost">View Roadmap</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {initiatives.map((initiative, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">{initiative.name}</h4>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>Due {new Date(initiative.dueDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{initiative.owner}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={initiative.risk === 'high' ? 'destructive' : 'secondary'}
                    >
                      {initiative.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span>{initiative.progress}%</span>
                    </div>
                    <Progress value={initiative.progress} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-auto py-3"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span>{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 mt-6">
            <h3 className="mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'PRD created', item: 'Biometric Auth Feature', time: '2h ago' },
                { action: 'Sprint completed', item: 'Sprint 24', time: '5h ago' },
                { action: 'Feedback analyzed', item: '47 new items', time: '1d ago' },
                { action: 'Idea upvoted', item: 'Dark Mode', time: '2d ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                  <div className="flex-1">
                    <p>
                      <span className="text-slate-900">{activity.action}:</span> {activity.item}
                    </p>
                    <span className="text-slate-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

