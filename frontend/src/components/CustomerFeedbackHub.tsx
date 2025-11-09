import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Search, TrendingUp, MessageSquare, Star, ThumbsUp, ThumbsDown, Plus, Edit, Trash2 } from 'lucide-react';
import { customerFeedbackService } from '../services/researchService';
import { CustomerFeedback } from '../types/CustomerFeedback';
import { ApiError } from '../services/api';

export function CustomerFeedbackHub() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerFeedbackService.list();
      setFeedbacks(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load customer feedbacks. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer feedback?')) return;
    try {
      await customerFeedbackService.delete(id);
      await loadFeedbacks();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete customer feedback. Please try again.');
      }
    }
  };

  const handleAnalyzeFeedback = async () => {
    try {
      setAnalyzing(true);
      const response = await aiService.analyzeCustomerFeedback(feedbacks);
      const analysis = response.data || response;
      
      toast({
        title: "AI Feedback Analysis",
        description: `Sentiment: ${analysis.sentiment || 'Analyzed'}`,
      });
    } catch (err: any) {
      console.error('Error analyzing feedback:', err);
      const errorMessage = err instanceof ApiError ? err.message : (err.message || 'Failed to analyze feedback. Please try again.');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const mockFeedbackItems = [
    {
      id: 'FB-1234',
      source: 'App Store Review',
      sentiment: 'Positive',
      rating: 5,
      text: 'Love the new updates! Would be even better with dark mode support.',
      category: ['Feature Request', 'UX'],
      upvotes: 47,
      date: '2025-11-06',
      user: 'Alex M.'
    },
    {
      id: 'FB-1235',
      source: 'Support Ticket',
      sentiment: 'Negative',
      rating: 2,
      text: 'Login is frustrating. Keep having to reset my password. Need Face ID!',
      category: ['Authentication', 'Pain Point'],
      upvotes: 34,
      date: '2025-11-06',
      user: 'Sarah K.'
    },
    {
      id: 'FB-1236',
      source: 'NPS Survey',
      sentiment: 'Neutral',
      rating: 3,
      text: 'App works fine but missing some features competitors have like investment tracking.',
      category: ['Feature Request', 'Competitive'],
      upvotes: 23,
      date: '2025-11-05',
      user: 'Michael T.'
    },
    {
      id: 'FB-1237',
      source: 'In-App Feedback',
      sentiment: 'Positive',
      rating: 5,
      text: 'Best mobile banking app! The AI budget insights are super helpful.',
      category: ['Praise', 'AI Features'],
      upvotes: 56,
      date: '2025-11-05',
      user: 'Jessica P.'
    },
    {
      id: 'FB-1238',
      source: 'Social Media',
      sentiment: 'Negative',
      rating: 1,
      text: 'App crashes when trying to split bills. Really annoying.',
      category: ['Bug', 'Payments'],
      upvotes: 12,
      date: '2025-11-04',
      user: 'David L.'
    }
  ];

  const trends = [
    { keyword: 'Dark Mode', mentions: 234, change: '+45%', sentiment: 'positive' },
    { keyword: 'Biometric Auth', mentions: 187, change: '+32%', sentiment: 'positive' },
    { keyword: 'Login Issues', mentions: 143, change: '+18%', sentiment: 'negative' },
    { keyword: 'Bill Split', mentions: 89, change: '+67%', sentiment: 'mixed' },
    { keyword: 'Investment Tracking', mentions: 76, change: '+12%', sentiment: 'positive' },
    { keyword: 'App Crashes', mentions: 54, change: '-8%', sentiment: 'negative' }
  ];

  const sentimentDistribution = {
    positive: 45,
    neutral: 32,
    negative: 23
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Customer Feedback Hub</h1>
          <p className="text-slate-600">Unified view of customer feedback from all sources</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            type="button"
            onClick={handleAnalyzeFeedback}
            disabled={analyzing || feedbacks.length === 0}
          >
            <Sparkles className="w-4 h-4" />
            {analyzing ? 'Analyzing...' : 'AI Analysis'}
          </Button>
          <Button className="gap-2" onClick={() => navigate('/workspace/feedback/create')}>
            <Plus className="w-4 h-4" />
            Add Feedback
          </Button>
        </div>
      </div>

      {/* Saved Customer Feedbacks */}
      {feedbacks.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Customer Feedbacks</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{feedback.title}</h4>
                    {feedback.description && <p className="text-slate-600 text-sm mt-1">{feedback.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{feedback.source || 'support'}</Badge>
                      <Badge variant="outline">{feedback.sentiment || 'neutral'}</Badge>
                      {feedback.rating && <span className="text-slate-600 text-sm">Rating: {feedback.rating}/5</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/feedback/edit/${feedback.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(feedback.id)}>
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
            <h4 className="mb-2">AI-Generated Insights (Last 7 Days)</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>234 mentions</strong> of "dark mode" - 45% increase from last week. High priority feature request.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>Authentication complaints</strong> up 18%. Biometric auth could reduce by 60%.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>Overall sentiment improving:</strong> 45% positive (up from 38% last month)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Sentiment Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Total Feedback</div>
          <div className="text-3xl mb-2">{mockFeedbackItems.length * 47}</div>
          <div className="text-slate-500">Last 30 days</div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="text-green-900 mb-2">Positive</div>
          <div className="text-3xl mb-2 text-green-600">{sentimentDistribution.positive}%</div>
          <div className="text-green-700">+7% from last month</div>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="text-yellow-900 mb-2">Neutral</div>
          <div className="text-3xl mb-2 text-yellow-600">{sentimentDistribution.neutral}%</div>
          <div className="text-yellow-700">-2% from last month</div>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-red-900 mb-2">Negative</div>
          <div className="text-3xl mb-2 text-red-600">{sentimentDistribution.negative}%</div>
          <div className="text-red-700">-5% from last month</div>
        </Card>
      </div>

      {/* Trending Topics */}
      <Card className="p-6">
        <h3 className="mb-4">Trending Topics</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((trend, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4>{trend.keyword}</h4>
                <Badge variant={
                  trend.sentiment === 'positive' ? 'default' :
                  trend.sentiment === 'negative' ? 'destructive' : 'secondary'
                }>
                  {trend.sentiment}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{trend.mentions} mentions</span>
                </div>
                <div className={`flex items-center gap-1 ${
                  trend.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{trend.change}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search feedback..." className="pl-10" />
          </div>
        </div>

        <Select defaultValue="all-sources">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sources">All Sources</SelectItem>
            <SelectItem value="app-store">App Store</SelectItem>
            <SelectItem value="support">Support Tickets</SelectItem>
            <SelectItem value="nps">NPS Surveys</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="in-app">In-App Feedback</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-sentiment">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sentiment">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="feature">Feature Requests</TabsTrigger>
          <TabsTrigger value="bugs">Bugs & Issues</TabsTrigger>
          <TabsTrigger value="praise">Praise</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockFeedbackItems.map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-blue-600">{item.id}</span>
                  <Badge variant="outline">{item.source}</Badge>
                  <Badge variant={
                    item.sentiment === 'Positive' ? 'default' :
                    item.sentiment === 'Negative' ? 'destructive' : 'secondary'
                  }>
                    {item.sentiment}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-slate-500">{new Date(item.date).toLocaleDateString()}</div>
              </div>

              <p className="mb-3 text-slate-700">{item.text}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">by {item.user}</span>
                  {item.category.map((cat, catIndex) => (
                    <Badge key={catIndex} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{item.upvotes}</span>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Link to Idea</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="feature">
          <Card className="p-6">
            <p className="text-slate-600">Showing feature requests...</p>
          </Card>
        </TabsContent>

        <TabsContent value="bugs">
          <Card className="p-6">
            <p className="text-slate-600">Showing bugs and issues...</p>
          </Card>
        </TabsContent>

        <TabsContent value="praise">
          <Card className="p-6">
            <p className="text-slate-600">Showing praise and positive feedback...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
