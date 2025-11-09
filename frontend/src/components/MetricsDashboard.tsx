import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, TrendingUp, TrendingDown, Users, DollarSign, Activity, AlertCircle, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';
import { metricService } from '../services/analyticsService';
import { Metric } from '../types/Metric';
import { ApiError } from '../services/api';

export function MetricsDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await metricService.list();
      setMetrics(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load metrics. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this metric?')) return;
    try {
      await metricService.delete(id);
      await loadMetrics();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete metric. Please try again.');
      }
    }
  };
  const kpis = [
    {
      metric: 'Active Users',
      value: '342,156',
      change: '+12.5%',
      trend: 'up',
      target: '350K',
      status: 'on-track'
    },
    {
      metric: 'Adoption Rate',
      value: '68%',
      change: '+5.2%',
      trend: 'up',
      target: '75%',
      status: 'on-track'
    },
    {
      metric: 'Retention (D30)',
      value: '82%',
      change: '-2.1%',
      trend: 'down',
      target: '85%',
      status: 'at-risk'
    },
    {
      metric: 'Conversion Rate',
      value: '3.4%',
      change: '+0.8%',
      trend: 'up',
      target: '4.0%',
      status: 'on-track'
    },
    {
      metric: 'NPS Score',
      value: '72',
      change: '+4',
      trend: 'up',
      target: '75',
      status: 'on-track'
    },
    {
      metric: 'Revenue (MRR)',
      value: '$1.24M',
      change: '+18.3%',
      trend: 'up',
      target: '$1.5M',
      status: 'on-track'
    }
  ];

  const featureMetrics = [
    {
      feature: 'Biometric Auth',
      adoption: 78,
      engagement: 95,
      satisfaction: 4.8,
      trend: 'up'
    },
    {
      feature: 'Dark Mode',
      adoption: 62,
      engagement: 88,
      satisfaction: 4.6,
      trend: 'up'
    },
    {
      feature: 'AI Budget Coach',
      adoption: 45,
      engagement: 72,
      satisfaction: 4.2,
      trend: 'stable'
    },
    {
      feature: 'Bill Split',
      adoption: 34,
      engagement: 65,
      satisfaction: 3.9,
      trend: 'down'
    },
    {
      feature: 'Savings Goals',
      adoption: 89,
      engagement: 92,
      satisfaction: 4.7,
      trend: 'up'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      metric: 'D30 Retention',
      message: 'Dropped 2.1% below target. Investigate user drop-off patterns.',
      time: '2 hours ago'
    },
    {
      type: 'success',
      metric: 'Revenue Growth',
      message: 'MRR exceeded forecast by $40K this month.',
      time: '5 hours ago'
    },
    {
      type: 'info',
      metric: 'Feature Adoption',
      message: 'Biometric auth adoption reached 78% - highest of any feature launch.',
      time: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Metrics Dashboard</h1>
          <p className="text-slate-600">Real-time product KPIs and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" type="button" onClick={() => navigate('/workspace/metrics/create')}>
            <Plus className="w-4 h-4" />
            Add Metric
          </Button>
          <Select defaultValue="30d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Saved Metrics */}
      {metrics.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Metrics</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{metric.title}</h4>
                    {metric.description && <p className="text-slate-600 text-sm mt-1">{metric.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{metric.metric_type || 'kpi'}</Badge>
                      {metric.value !== undefined && <span className="text-slate-600 text-sm">{metric.value} {metric.unit || ''}</span>}
                      {metric.date && <span className="text-slate-600 text-sm">Date: {metric.date.split('T')[0]}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => navigate(`/workspace/metrics/edit/${metric.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" type="button" onClick={() => handleDelete(metric.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Metric Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Card 
              key={index}
              className={`p-4 border-l-4 ${
                alert.type === 'warning' ? 'border-orange-500 bg-orange-50' :
                alert.type === 'success' ? 'border-green-500 bg-green-50' :
                'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  alert.type === 'warning' ? 'text-orange-600' :
                  alert.type === 'success' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <strong>{alert.metric}</strong>
                    <span className="text-slate-500">• {alert.time}</span>
                  </div>
                  <p className="text-slate-700">{alert.message}</p>
                </div>
                <Button variant="ghost" size="sm">Investigate</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="text-slate-600">{kpi.metric}</div>
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="text-3xl mb-2">{kpi.value}</div>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1 ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{kpi.change}</span>
                <span className="text-slate-500">vs last period</span>
              </div>
              <Badge variant={kpi.status === 'on-track' ? 'default' : 'destructive'}>
                {kpi.status === 'on-track' ? 'On Track' : 'At Risk'}
              </Badge>
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between text-slate-600">
                <span>Target:</span>
                <span>{kpi.target}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card className="p-6">
            <h3 className="mb-4">User Growth & Retention</h3>
            <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-slate-400">
                <Activity className="w-16 h-16 mx-auto mb-4" />
                <p>Growth chart visualization</p>
                <p className="text-slate-500">Active users, new signups, retention cohorts</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-slate-600 mb-1">New Users (30d)</div>
                <div className="text-2xl">24,532</div>
                <div className="text-green-600">+15.2% vs last month</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-slate-600 mb-1">Churn Rate</div>
                <div className="text-2xl">3.2%</div>
                <div className="text-green-600">-0.5% vs last month</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-slate-600 mb-1">D7 Retention</div>
                <div className="text-2xl">91%</div>
                <div className="text-green-600">+2.1% vs last month</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className="p-6">
            <h3 className="mb-4">User Engagement Metrics</h3>
            <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-slate-400">
                <Activity className="w-16 h-16 mx-auto mb-4" />
                <p>Engagement chart visualization</p>
                <p className="text-slate-500">DAU/MAU, session length, feature usage</p>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-slate-600 mb-1">DAU/MAU</div>
                <div className="text-2xl">42%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-slate-600 mb-1">Avg Session</div>
                <div className="text-2xl">8.5 min</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-slate-600 mb-1">Sessions/Day</div>
                <div className="text-2xl">3.2</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-slate-600 mb-1">Stickiness</div>
                <div className="text-2xl">68%</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="p-6">
            <h3 className="mb-4">Revenue & Monetization</h3>
            <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-slate-400">
                <DollarSign className="w-16 h-16 mx-auto mb-4" />
                <p>Revenue chart visualization</p>
                <p className="text-slate-500">MRR, ARPU, LTV, conversion funnel</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-slate-600 mb-1">ARPU</div>
                <div className="text-2xl">$3.62</div>
                <div className="text-green-600">+8.1% vs last month</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-slate-600 mb-1">LTV</div>
                <div className="text-2xl">$287</div>
                <div className="text-green-600">+12.3% vs last month</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-slate-600 mb-1">Payback Period</div>
                <div className="text-2xl">4.2 mo</div>
                <div className="text-green-600">-0.3 mo vs last month</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="p-6">
            <h3 className="mb-4">Feature Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3">Feature</th>
                    <th className="text-left p-3">Adoption</th>
                    <th className="text-left p-3">Engagement</th>
                    <th className="text-left p-3">Satisfaction</th>
                    <th className="text-left p-3">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {featureMetrics.map((feature, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-3">{feature.feature}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-24">
                            <div 
                              className="h-full bg-blue-600"
                              style={{width: `${feature.adoption}%`}}
                            />
                          </div>
                          <span>{feature.adoption}%</span>
                        </div>
                      </td>
                      <td className="p-3">{feature.engagement}%</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{feature.satisfaction}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {feature.trend === 'up' && (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        )}
                        {feature.trend === 'down' && (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        {feature.trend === 'stable' && (
                          <Activity className="w-5 h-5 text-slate-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
