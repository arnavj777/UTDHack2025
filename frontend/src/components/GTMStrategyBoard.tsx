import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Target, Users, DollarSign, Megaphone, Calendar, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { gtmStrategyService } from '../services/gtmService';
import { GTMStrategy } from '../types/GTMStrategy';
import { ApiError } from '../services/api';

export function GTMStrategyBoard() {
  const navigate = useNavigate();
  const [gtmStrategies, setGtmStrategies] = useState<GTMStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGTMStrategies();
  }, []);

  const loadGTMStrategies = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await gtmStrategyService.list();
      setGtmStrategies(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load GTM strategies. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this GTM strategy?')) return;
    try {
      await gtmStrategyService.delete(id);
      await loadGTMStrategies();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete GTM strategy. Please try again.');
      }
    }
  };
  const channels = [
    { name: 'Email Marketing', priority: 'High', cost: '$5K', reach: '50K', roi: '320%' },
    { name: 'Social Media', priority: 'High', cost: '$8K', reach: '200K', roi: '280%' },
    { name: 'Content Marketing', priority: 'Medium', cost: '$12K', reach: '100K', roi: '250%' },
    { name: 'Paid Ads', priority: 'Medium', cost: '$20K', reach: '500K', roi: '180%' },
    { name: 'PR & Media', priority: 'Low', cost: '$15K', reach: '1M', roi: '150%' },
    { name: 'Partner Marketing', priority: 'Medium', cost: '$10K', reach: '75K', roi: '290%' }
  ];

  const personas = [
    { name: 'Tech-Savvy Millennial', percentage: 35, fit: 'High' },
    { name: 'Budget-Conscious Parent', percentage: 28, fit: 'Medium' },
    { name: 'Early Career Professional', percentage: 22, fit: 'High' },
    { name: 'Gig Economy Worker', percentage: 15, fit: 'Medium' }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Go-to-Market Strategy Board</h1>
          <p className="text-slate-600">Plan and execute your product launch strategy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Strategy Recommendations
          </Button>
          <Button className="gap-2" onClick={() => navigate('/workspace/gtm-strategy/create')}>
            <Plus className="w-4 h-4" />
            Add GTM Strategy
          </Button>
        </div>
      </div>

      {/* Saved GTM Strategies */}
      {gtmStrategies.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved GTM Strategies</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {gtmStrategies.map((gtm) => (
                <div key={gtm.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{gtm.title}</h4>
                    {gtm.description && <p className="text-slate-600 text-sm mt-1">{gtm.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{gtm.status || 'draft'}</Badge>
                      {gtm.launch_date && <span className="text-slate-600 text-sm">Launch: {gtm.launch_date.split('T')[0]}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/gtm-strategy/edit/${gtm.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(gtm.id)}>
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

      {/* AI Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI Channel Strategy Recommendations</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>Focus on Email & Social Media</strong> - highest ROI for your target personas (320% and 280%)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Consider <strong>Partner Marketing</strong> - 290% ROI and strong fit with Tech-Savvy Millennials
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Recommended budget split: 40% Email, 30% Social, 20% Partner, 10% Content
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Launch Objectives */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3>Launch Objectives</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Primary Goal</label>
                  <Select defaultValue="acquisition">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acquisition">User Acquisition</SelectItem>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                      <SelectItem value="revenue">Revenue Growth</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label>Launch Date</label>
                  <Input type="date" defaultValue="2026-01-15" />
                </div>
              </div>

              <div className="space-y-2">
                <label>Success Metrics</label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Input placeholder="New Users" defaultValue="10,000" />
                    <span className="text-slate-500">Target: New users in first month</span>
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Activation Rate" defaultValue="35%" />
                    <span className="text-slate-500">Target: % who complete setup</span>
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Revenue" defaultValue="$150K" />
                    <span className="text-slate-500">Target: First month revenue</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Target Personas */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3>Target Personas for Launch</h3>
            </div>

            <div className="space-y-3">
              {personas.map((persona, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>{persona.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{persona.percentage}% of market</Badge>
                      <Badge variant={persona.fit === 'High' ? 'default' : 'secondary'}>
                        {persona.fit} Fit
                      </Badge>
                    </div>
                  </div>
                  <p className="text-slate-600 ml-7">
                    Recommended messaging: Emphasize {persona.fit === 'High' ? 'innovation and features' : 'value and reliability'}
                  </p>
                </Card>
              ))}
            </div>
          </Card>

          {/* Pricing Strategy */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3>Launch Pricing Strategy</h3>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Pricing Model</label>
                  <Select defaultValue="freemium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="usage">Usage-based</SelectItem>
                      <SelectItem value="tiered">Tiered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label>Launch Offer</label>
                  <Select defaultValue="trial">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">14-day free trial</SelectItem>
                      <SelectItem value="discount">20% off first 3 months</SelectItem>
                      <SelectItem value="lifetime">Lifetime deal for early adopters</SelectItem>
                      <SelectItem value="none">No special offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-1">AI Pricing Recommendation</h4>
                    <p className="text-slate-700">
                      Based on competitor analysis, recommend starting with <strong>freemium model + 14-day trial</strong> for premium features. 
                      This increases conversion by 45% for similar products.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          {/* Channel Strategy */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-orange-600" />
              <h3>Marketing Channels</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3">Channel</th>
                    <th className="text-left p-3">Priority</th>
                    <th className="text-left p-3">Budget</th>
                    <th className="text-left p-3">Reach</th>
                    <th className="text-left p-3">Est. ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((channel, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-3">{channel.name}</td>
                      <td className="p-3">
                        <Badge variant={
                          channel.priority === 'High' ? 'default' :
                          channel.priority === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {channel.priority}
                        </Badge>
                      </td>
                      <td className="p-3">{channel.cost}</td>
                      <td className="p-3">{channel.reach}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          {channel.roi}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4>Launch Timeline</h4>
            </div>

            <div className="space-y-3">
              {[
                { phase: 'Pre-launch (T-30)', status: 'In Progress', date: 'Dec 15' },
                { phase: 'Soft Launch (T-14)', status: 'Planned', date: 'Jan 1' },
                { phase: 'Public Launch (T-0)', status: 'Planned', date: 'Jan 15' },
                { phase: 'Post-launch (T+7)', status: 'Planned', date: 'Jan 22' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'In Progress' ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                  <div className="flex-1">
                    <div>{item.phase}</div>
                    <div className="text-slate-500">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Budget Summary */}
          <Card className="p-6">
            <h4 className="mb-4">Budget Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Budget</span>
                <span>$70,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Allocated</span>
                <span className="text-green-600">$70,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Remaining</span>
                <span>$0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 w-full" />
              </div>
            </div>
          </Card>

          {/* Competitive Timing */}
          <Card className="p-6">
            <h4 className="mb-4">Market Timing</h4>
            <div className="space-y-3 text-slate-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Q1 is peak season for banking apps (+35% signups)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>No major competitor launches expected in Jan</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2" />
                <span>Chime planning major update in Feb</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
