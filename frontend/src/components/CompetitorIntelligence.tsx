import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { competitorIntelService } from '../services/researchService';
import { CompetitorIntel } from '../types/CompetitorIntel';
import { ApiError } from '../services/api';

export function CompetitorIntelligence() {
  const navigate = useNavigate();
  const [competitorIntels, setCompetitorIntels] = useState<CompetitorIntel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompetitorIntels();
  }, []);

  const loadCompetitorIntels = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await competitorIntelService.list();
      setCompetitorIntels(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load competitor intelligence. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this competitor intelligence?')) return;
    try {
      await competitorIntelService.delete(id);
      await loadCompetitorIntels();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete competitor intelligence. Please try again.');
      }
    }
  };
  const competitors = [
    {
      name: 'Chime',
      logo: '🟢',
      marketShare: 15,
      features: ['Early Direct Deposit', 'No Fees', 'Savings Pods', 'Credit Builder'],
      pricing: 'Free',
      userBase: '14.5M',
      recentUpdate: 'Launched savings pods feature with gamification',
      sentiment: 87,
      threat: 'High'
    },
    {
      name: 'Cash App',
      logo: '🟩',
      marketShare: 22,
      features: ['P2P Payments', 'Bitcoin', 'Stocks', 'Cash Card'],
      pricing: 'Free (fees on some features)',
      userBase: '51M',
      recentUpdate: 'Added tax filing service partnership',
      sentiment: 72,
      threat: 'High'
    },
    {
      name: 'Venmo',
      logo: '🔵',
      marketShare: 18,
      features: ['Social Payments', 'Venmo Card', 'Crypto', 'Business Profiles'],
      pricing: 'Free',
      userBase: '90M',
      recentUpdate: 'Introduced business QR codes',
      sentiment: 78,
      threat: 'Medium'
    },
    {
      name: 'Revolut',
      logo: '⚪',
      marketShare: 8,
      features: ['Multi-Currency', 'Crypto', 'Stock Trading', 'Travel Insurance'],
      pricing: 'Freemium ($9.99-$45/mo premium)',
      userBase: '35M',
      recentUpdate: 'Expanded to stock trading in 18 countries',
      sentiment: 81,
      threat: 'Medium'
    }
  ];

  const featureComparison = [
    { feature: 'Biometric Auth', us: false, chime: true, cashapp: true, venmo: true, revolut: true },
    { feature: 'Dark Mode', us: false, chime: false, cashapp: true, venmo: false, revolut: true },
    { feature: 'AI Insights', us: true, chime: false, cashapp: false, venmo: false, revolut: false },
    { feature: 'Bill Split', us: false, chime: false, cashapp: true, venmo: true, revolut: false },
    { feature: 'Savings Goals', us: true, chime: true, cashapp: false, venmo: false, revolut: true },
    { feature: 'Crypto Trading', us: false, chime: false, cashapp: true, venmo: true, revolut: true },
    { feature: 'Stock Trading', us: false, chime: false, cashapp: true, venmo: false, revolut: true },
    { feature: 'No Monthly Fees', us: true, chime: true, cashapp: true, venmo: true, revolut: false }
  ];

  const recentNews = [
    {
      competitor: 'Chime',
      headline: 'Chime raises $750M at $25B valuation',
      date: '2025-10-28',
      impact: 'High',
      summary: 'Major funding round indicates aggressive expansion plans'
    },
    {
      competitor: 'Cash App',
      headline: 'Cash App adds tax filing feature',
      date: '2025-11-01',
      impact: 'Medium',
      summary: 'Expanding beyond payments into financial services'
    },
    {
      competitor: 'Venmo',
      headline: 'Venmo hits 100M user milestone',
      date: '2025-10-15',
      impact: 'Medium',
      summary: 'Strong user growth in younger demographics'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Competitor Intelligence</h1>
          <p className="text-slate-600">Track and analyze competitor moves in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => navigate('/workspace/competitors/create')}>
            <Plus className="w-4 h-4" />
            Add Competitor Intel
          </Button>
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Saved Competitor Intelligence */}
      {competitorIntels.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Competitor Intelligence</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {competitorIntels.map((intel) => (
                <div key={intel.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{intel.title}</h4>
                    {intel.description && <p className="text-slate-600 text-sm mt-1">{intel.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{intel.competitor_name || 'Unknown'}</Badge>
                      <Badge variant="outline">{intel.intel_type || 'feature'}</Badge>
                      {intel.date && <span className="text-slate-600 text-sm">Date: {intel.date.split('T')[0]}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/competitors/edit/${intel.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(intel.id)}>
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

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI Competitive Intelligence</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  <strong>Chime's savings pods feature</strong> saw 87% positive sentiment - consider similar gamification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  You're ahead on <strong>AI-powered insights</strong> - none of top competitors have this yet
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingDown className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  <strong>Biometric auth gap:</strong> All major competitors offer this, but you don't (yet)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Market Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Tracked Competitors</div>
          <div className="text-3xl mb-2">{competitors.length}</div>
          <div className="text-slate-500">Active monitoring</div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Feature Gap</div>
          <div className="text-3xl mb-2 text-orange-600">3</div>
          <div className="text-slate-500">Missing features</div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Opportunities</div>
          <div className="text-3xl mb-2 text-green-600">2</div>
          <div className="text-slate-500">Unique advantages</div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Recent Updates</div>
          <div className="text-3xl mb-2">{recentNews.length}</div>
          <div className="text-slate-500">Last 30 days</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Feature Comparison</TabsTrigger>
          <TabsTrigger value="news">Recent News</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {competitors.map((competitor, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{competitor.logo}</div>
                  <div>
                    <h3 className="mb-1">{competitor.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{competitor.userBase} users</Badge>
                      <Badge variant={
                        competitor.threat === 'High' ? 'destructive' : 'secondary'
                      }>
                        {competitor.threat} Threat
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-600 mb-1">Market Share</div>
                  <div className="text-2xl">{competitor.marketShare}%</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-slate-600 mb-2">Key Features</div>
                  <div className="flex flex-wrap gap-2">
                    {competitor.features.map((feature, fIndex) => (
                      <Badge key={fIndex} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-slate-600 mb-2">Pricing Model</div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{competitor.pricing}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-slate-600 mb-1">Recent Update</div>
                    <p>{competitor.recentUpdate}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-slate-600 mb-1">User Sentiment</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{competitor.sentiment}%</div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">View Full Profile</Button>
                <Button variant="outline" size="sm">Export Report</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="features">
          <Card className="p-6">
            <h3 className="mb-6">Feature Comparison Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3">Feature</th>
                    <th className="text-center p-3">Us</th>
                    <th className="text-center p-3">Chime</th>
                    <th className="text-center p-3">Cash App</th>
                    <th className="text-center p-3">Venmo</th>
                    <th className="text-center p-3">Revolut</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-3">{row.feature}</td>
                      <td className="text-center p-3">
                        {row.us ? (
                          <span className="text-green-600 text-xl">✓</span>
                        ) : (
                          <span className="text-red-400 text-xl">✗</span>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {row.chime ? (
                          <span className="text-green-600 text-xl">✓</span>
                        ) : (
                          <span className="text-slate-300 text-xl">✗</span>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {row.cashapp ? (
                          <span className="text-green-600 text-xl">✓</span>
                        ) : (
                          <span className="text-slate-300 text-xl">✗</span>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {row.venmo ? (
                          <span className="text-green-600 text-xl">✓</span>
                        ) : (
                          <span className="text-slate-300 text-xl">✗</span>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {row.revolut ? (
                          <span className="text-green-600 text-xl">✓</span>
                        ) : (
                          <span className="text-slate-300 text-xl">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-6 border-t grid md:grid-cols-2 gap-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="text-green-900 mb-2">Our Advantages</h4>
                <ul className="space-y-1 text-green-800">
                  <li>• AI-powered insights (unique)</li>
                  <li>• No monthly fees</li>
                  <li>• Savings goals with gamification</li>
                </ul>
              </Card>
              <Card className="p-4 bg-red-50 border-red-200">
                <h4 className="text-red-900 mb-2">Feature Gaps</h4>
                <ul className="space-y-1 text-red-800">
                  <li>• Biometric authentication</li>
                  <li>• Dark mode</li>
                  <li>• Bill split feature</li>
                </ul>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <div className="space-y-4">
            {recentNews.map((news, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{news.competitor}</Badge>
                      <Badge variant={
                        news.impact === 'High' ? 'destructive' : 'secondary'
                      }>
                        {news.impact} Impact
                      </Badge>
                      <span className="text-slate-500">{new Date(news.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="mb-2">{news.headline}</h4>
                    <p className="text-slate-600">{news.summary}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Read More</Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Analysis
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <Card className="p-6">
            <h3 className="mb-6">Pricing Strategy Comparison</h3>
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1">{competitor.name}</h4>
                      <p className="text-slate-600">{competitor.pricing}</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
