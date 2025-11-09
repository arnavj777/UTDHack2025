import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Lightbulb, Sparkles, Plus, ThumbsUp, MessageSquare, TrendingUp, Filter, Search, Edit, Trash2 } from 'lucide-react';
import { ideaService } from '../services/strategyService';
import { Idea } from '../types/Idea';
import { ApiError } from '../services/api';

export function IdeaRepository() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ideaService.list();
      setIdeas(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load ideas. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;
    try {
      await ideaService.delete(id);
      await loadIdeas();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete idea. Please try again.');
      }
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = !searchQuery || idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (idea.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const mockIdeas = [
    {
      title: 'Dark Mode Support',
      description: 'Add system-wide dark mode to reduce eye strain for users who bank at night',
      author: 'Sarah Chen',
      votes: 47,
      comments: 12,
      impact: 'High',
      effort: 'Medium',
      score: 8.5,
      status: 'Under Review',
      tags: ['UX', 'Accessibility', 'Quick Win'],
      source: 'Customer Feedback'
    },
    {
      title: 'Biometric Authentication',
      description: 'Enable Face ID and fingerprint login for faster, more secure access',
      author: 'AI Generated',
      votes: 34,
      comments: 8,
      impact: 'High',
      effort: 'High',
      score: 7.2,
      status: 'Planned',
      tags: ['Security', 'UX'],
      source: 'AI Suggestion'
    },
    {
      title: 'Savings Goals with Visual Progress',
      description: 'Allow users to create multiple savings goals with progress tracking and celebratory animations',
      author: 'Michael Torres',
      votes: 56,
      comments: 15,
      impact: 'High',
      effort: 'Medium',
      score: 9.1,
      status: 'In Progress',
      tags: ['Engagement', 'Savings', 'Gamification'],
      source: 'Team Member'
    },
    {
      title: 'Bill Split Calculator',
      description: 'Built-in tool to split bills among friends and send payment requests',
      author: 'Jessica Kumar',
      votes: 23,
      comments: 5,
      impact: 'Medium',
      effort: 'Low',
      score: 6.8,
      status: 'New',
      tags: ['Social', 'Payments'],
      source: 'Team Member'
    },
    {
      title: 'AI Budget Coach',
      description: 'Personalized spending insights and budget recommendations based on user behavior',
      author: 'AI Generated',
      votes: 61,
      comments: 19,
      impact: 'Very High',
      effort: 'High',
      score: 8.9,
      status: 'Under Review',
      tags: ['AI', 'Personalization', 'Financial Health'],
      source: 'AI Suggestion'
    },
    {
      title: 'Recurring Transaction Detection',
      description: 'Automatically identify and tag recurring payments for better budget tracking',
      author: 'AI Generated',
      votes: 29,
      comments: 7,
      impact: 'Medium',
      effort: 'Medium',
      score: 6.5,
      status: 'New',
      tags: ['AI', 'Automation'],
      source: 'AI Suggestion'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High':
      case 'High':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Planned':
        return 'bg-purple-100 text-purple-700';
      case 'Under Review':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Idea Repository</h1>
          <p className="text-slate-600">Capture, prioritize, and track product ideas from all sources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Ideas with AI
          </Button>
          <Button className="gap-2" type="button" onClick={() => navigate('/workspace/ideas/create')}>
            <Plus className="w-4 h-4" />
            Add Idea
          </Button>
        </div>
      </div>

      {/* AI Suggestions Banner */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI-Generated Ideas Available</h4>
            <p className="text-slate-700 mb-4">
              Based on customer feedback analysis, market trends, and competitor intelligence, 
              we've identified 8 new potential features for your consideration.
            </p>
            <Button variant="outline" size="sm">Review AI Suggestions</Button>
          </div>
        </div>
      </Card>

      {/* Filters & Search */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search ideas..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="score">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Sort by Score</SelectItem>
            <SelectItem value="votes">Sort by Votes</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="impact">High Impact</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Ideas ({filteredIdeas.length})</TabsTrigger>
          <TabsTrigger value="customer">From Customers</TabsTrigger>
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
          <TabsTrigger value="team">Team Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card className="p-6">
              <p className="text-slate-600">Loading ideas...</p>
            </Card>
          ) : error ? (
            <Card className="p-6">
              <p className="text-red-600">{error}</p>
            </Card>
          ) : filteredIdeas.length === 0 ? (
            <Card className="p-6">
              <p className="text-slate-600">No ideas found. Create your first idea!</p>
            </Card>
          ) : (
            filteredIdeas.map((idea) => (
            <Card key={idea.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-1 min-w-16">
                  <Button variant="outline" size="sm" type="button" className="w-full">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <span className="font-mono">{idea.impact_score || 0}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{idea.title}</h4>
                        {idea.data?.source === 'AI Suggestion' && (
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3">{idea.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getStatusColor(idea.status)}>
                      {idea.status}
                    </Badge>
                    {idea.impact_score > 0 && (
                      <Badge className={idea.impact_score >= 7 ? 'bg-green-100 text-green-700' : idea.impact_score >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}>
                        Impact: {idea.impact_score}
                      </Badge>
                    )}
                    {idea.effort_score > 0 && (
                      <Badge variant="outline">
                        Effort: {idea.effort_score}
                      </Badge>
                    )}
                    {idea.tags && idea.tags.length > 0 && (
                      <div className="ml-auto flex gap-1">
                        {idea.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => navigate(`/workspace/ideas/edit/${idea.id}`)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" type="button" onClick={() => handleDelete(idea.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="customer">
          <Card className="p-6">
            <p className="text-slate-600">Showing ideas sourced from customer feedback...</p>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="p-6">
            <p className="text-slate-600">Showing AI-generated ideas...</p>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="p-6">
            <p className="text-slate-600">Showing ideas from team members...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
