import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Plus, Search, FileText, BarChart3, Users, TrendingUp, Download, Edit, Trash2 } from 'lucide-react';
import { researchDocumentService } from '../services/researchService';
import { ResearchDocument } from '../types/ResearchDocument';
import { ApiError } from '../services/api';

export function ResearchVault() {
  const navigate = useNavigate();
  const [researchDocs, setResearchDocs] = useState<ResearchDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gettingInsights, setGettingInsights] = useState(false);

  useEffect(() => {
    loadResearchDocs();
  }, []);

  const loadResearchDocs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await researchDocumentService.list();
      setResearchDocs(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load research documents. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this research document?')) return;
    try {
      await researchDocumentService.delete(id);
      await loadResearchDocs();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete research document. Please try again.');
      }
    }
  };

  const handleGetResearchInsights = async () => {
    try {
      setGettingInsights(true);
      const response = await aiService.getResearchInsights('Research query', researchDocs);
      const insights = response.data || response;
      
      toast({
        title: "AI Research Insights",
        description: insights.answer || 'Insights generated successfully',
      });
    } catch (err: any) {
      console.error('Error getting research insights:', err);
      const errorMessage = err instanceof ApiError ? err.message : (err.message || 'Failed to get research insights. Please try again.');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGettingInsights(false);
    }
  };

  const mockResearch = [
    {
      title: 'Q4 2025 Mobile Banking Trends Report',
      type: 'Market Research',
      date: '2025-11-01',
      author: 'Research Team',
      tags: ['Market Trends', 'Banking', 'Mobile'],
      summary: 'Comprehensive analysis of mobile banking industry trends, user behavior shifts, and emerging technologies.',
      keyFindings: [
        'Biometric auth adoption up 45% YoY',
        'Gen Z users prefer app-only banks 3:1',
        'AI features drive 2.3x engagement'
      ]
    },
    {
      title: 'User Interview Summary: Millennials (n=50)',
      type: 'User Research',
      date: '2025-10-28',
      author: 'Sarah Chen',
      tags: ['User Interviews', 'Millennials', 'Qualitative'],
      summary: '50 in-depth interviews with millennial users aged 28-35 about banking needs and frustrations.',
      keyFindings: [
        '87% want better savings visualization',
        'Dark mode is #1 requested feature',
        'Trust concerns around AI financial advice'
      ]
    },
    {
      title: 'Biometric Authentication Feasibility Study',
      type: 'Technical Research',
      date: '2025-10-22',
      author: 'Engineering Team',
      tags: ['Technical', 'Security', 'Biometric'],
      summary: 'Technical evaluation of implementing Face ID and fingerprint authentication across iOS and Android.',
      keyFindings: [
        'iOS integration: 2-3 weeks',
        'Android complexity higher due to fragmentation',
        'Security audit required for compliance'
      ]
    },
    {
      title: 'Competitive Analysis: Chime vs Cash App',
      type: 'Competitive Analysis',
      date: '2025-10-15',
      author: 'Product Team',
      tags: ['Competitive', 'Chime', 'Cash App'],
      summary: 'Deep dive comparison of Chime and Cash App features, pricing, and user sentiment.',
      keyFindings: [
        'Chime leads on customer service (NPS: 72)',
        'Cash App dominates P2P payments',
        'Both lack AI-powered insights'
      ]
    },
    {
      title: 'A/B Test Results: Onboarding Flow Redesign',
      type: 'Experiment Results',
      date: '2025-10-10',
      author: 'Growth Team',
      tags: ['A/B Test', 'Onboarding', 'Conversion'],
      summary: 'Results from 2-week A/B test of simplified onboarding flow with 10K users.',
      keyFindings: [
        'New flow: +23% completion rate',
        'Time to complete: -40%',
        'No change in activation rate (week 1)'
      ]
    },
    {
      title: 'Banking Regulation Compliance Guide 2025',
      type: 'Compliance Research',
      date: '2025-10-05',
      author: 'Legal Team',
      tags: ['Compliance', 'Regulations', 'Banking'],
      summary: 'Updated compliance requirements for digital banking products in regulated markets.',
      keyFindings: [
        'New KYC requirements effective Q1 2026',
        'Biometric data handling guidelines updated',
        'Consumer protection laws expanded'
      ]
    }
  ];

  const stats = [
    { label: 'Total Documents', value: '143', icon: FileText },
    { label: 'Market Reports', value: '24', icon: BarChart3 },
    { label: 'User Studies', value: '38', icon: Users },
    { label: 'This Month', value: '12', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Research Vault</h1>
          <p className="text-slate-600">Centralized repository for all product research and insights</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            type="button"
            onClick={handleGetResearchInsights}
            disabled={gettingInsights}
          >
            <Sparkles className="w-4 h-4" />
            {gettingInsights ? 'Analyzing...' : 'AI Research Assistant'}
          </Button>
          <Button className="gap-2" onClick={() => navigate('/workspace/research/create')}>
            <Plus className="w-4 h-4" />
            Add Research
          </Button>
        </div>
      </div>

      {/* Saved Research Documents */}
      {researchDocs.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Research Documents</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {researchDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{doc.title}</h4>
                    {doc.description && <p className="text-slate-600 text-sm mt-1">{doc.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{doc.document_type || 'research'}</Badge>
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex gap-1">
                          {doc.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/research/edit/${doc.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
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

      {/* AI Research Assistant */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-3">AI Research Assistant</h4>
            <div className="bg-white rounded-lg p-4 mb-3">
              <Input 
                placeholder="Ask me anything about your research... (e.g., 'What do users say about dark mode?')"
                className="border-0 focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">Recent findings on biometric auth</Button>
              <Button variant="outline" size="sm">Top user pain points</Button>
              <Button variant="outline" size="sm">Competitive advantages</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-600">{stat.label}</div>
              <stat.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl">{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search research..." className="pl-10" />
          </div>
        </div>

        <Select defaultValue="all-types">
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Research Types</SelectItem>
            <SelectItem value="market">Market Research</SelectItem>
            <SelectItem value="user">User Research</SelectItem>
            <SelectItem value="technical">Technical Research</SelectItem>
            <SelectItem value="competitive">Competitive Analysis</SelectItem>
            <SelectItem value="experiment">Experiment Results</SelectItem>
            <SelectItem value="compliance">Compliance Research</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="recent">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="relevant">Most Relevant</SelectItem>
            <SelectItem value="popular">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Research</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="user">User Studies</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockResearch.map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3>{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{item.type}</Badge>
                    <span className="text-slate-500">by {item.author}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 mb-4">{item.summary}</p>

              <div className="mb-4">
                <h4 className="mb-2">Key Findings:</h4>
                <ul className="space-y-1">
                  {item.keyFindings.map((finding, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                      <span className="text-slate-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Full Report</Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="market">
          <Card className="p-6">
            <p className="text-slate-600">Showing market research reports...</p>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card className="p-6">
            <p className="text-slate-600">Showing user research studies...</p>
          </Card>
        </TabsContent>

        <TabsContent value="competitive">
          <Card className="p-6">
            <p className="text-slate-600">Showing competitive analysis reports...</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="outline" className="justify-start gap-2">
            <Plus className="w-4 h-4" />
            Conduct Market Research
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <Users className="w-4 h-4" />
            Schedule User Interviews
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <BarChart3 className="w-4 h-4" />
            Run A/B Test
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </Card>
    </div>
  );
}
