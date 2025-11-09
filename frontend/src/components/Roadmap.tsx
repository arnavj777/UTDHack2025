import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Sparkles, Plus, Calendar, Filter, Layout, Edit, Trash2 } from 'lucide-react';
import { roadmapService } from '../services/developmentService';
import { Roadmap as RoadmapType } from '../types/Roadmap';
import { ApiError } from '../services/api';
import { aiService } from '../services/aiService';
import { toast } from './ui/use-toast';

export function Roadmap() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<RoadmapType[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prioritizing, setPrioritizing] = useState(false);
  const [showAIPrioritization, setShowAIPrioritization] = useState(false);
  const [aiPrioritization, setAiPrioritization] = useState<any>(null);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  useEffect(() => {
    // Auto-select first roadmap when roadmaps are loaded
    if (roadmaps.length > 0 && !selectedRoadmap) {
      setSelectedRoadmap(roadmaps[0]);
    }
  }, [roadmaps]);

  const loadRoadmaps = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await roadmapService.list();
      setRoadmaps(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load roadmaps. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this roadmap?')) return;
    try {
      await roadmapService.delete(id);
      await loadRoadmaps();
      // If deleted roadmap was selected, clear selection
      if (selectedRoadmap?.id === id) {
        setSelectedRoadmap(null);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete roadmap. Please try again.');
      }
    }
  };

  const handlePrioritizeRoadmap = async () => {
    try {
      setPrioritizing(true);
      const initiatives = selectedRoadmap?.data?.initiatives || [];
      const response = await aiService.prioritizeRoadmap(initiatives);
      const prioritization = response.data || response;
      
      setAiPrioritization(prioritization);
      setShowAIPrioritization(true);
      
      toast({
        title: "AI Roadmap Prioritization Generated",
        description: "View the full prioritization in the dialog",
      });
    } catch (err: any) {
      console.error('Error prioritizing roadmap:', err);
      const errorMessage = err instanceof ApiError ? err.message : (err.message || 'Failed to prioritize roadmap. Please try again.');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPrioritizing(false);
    }
  };

  // Parse roadmap data or use defaults
  const getRoadmapData = () => {
    if (!selectedRoadmap) {
      return {
        quarters: [],
        timelineView: [],
        dependencies: [],
        startDate: null,
        endDate: null
      };
    }

    const data = selectedRoadmap.data || {};
    return {
      quarters: data.quarters || [],
      timelineView: data.timelineView || [],
      dependencies: data.dependencies || [],
      startDate: selectedRoadmap.start_date,
      endDate: selectedRoadmap.end_date
    };
  };

  const roadmapData = getRoadmapData();
  
  // Default quarters if none in roadmap data
  const defaultQuarters = [
    {
      name: 'Q4 2025',
      initiatives: [
        { name: 'Mobile App Redesign', status: 'In Progress', progress: 75, team: 'Design', priority: 'High' },
        { name: 'Dark Mode Support', status: 'In Progress', progress: 60, team: 'Engineering', priority: 'Medium' },
      ]
    },
    {
      name: 'Q1 2026',
      initiatives: [
        { name: 'Biometric Authentication', status: 'Planned', progress: 0, team: 'Engineering', priority: 'High' },
        { name: 'AI Budget Coach', status: 'Planned', progress: 0, team: 'AI/ML', priority: 'High' },
        { name: 'Bill Split Feature', status: 'Planned', progress: 0, team: 'Product', priority: 'Medium' },
      ]
    },
    {
      name: 'Q2 2026',
      initiatives: [
        { name: 'Savings Goals v2', status: 'Future', progress: 0, team: 'Product', priority: 'Medium' },
        { name: 'Investment Tracking', status: 'Future', progress: 0, team: 'FinTech', priority: 'High' },
      ]
    },
    {
      name: 'Q3 2026',
      initiatives: [
        { name: 'Social Payments', status: 'Future', progress: 0, team: 'Product', priority: 'Low' },
        { name: 'Credit Score Monitoring', status: 'Future', progress: 0, team: 'FinTech', priority: 'Medium' },
      ]
    }
  ];

  const defaultTimelineView = [
    { 
      name: 'Mobile App Redesign', 
      start: 10, 
      duration: 30, 
      color: 'bg-blue-500',
      status: 'In Progress'
    },
    { 
      name: 'Dark Mode Support', 
      start: 15, 
      duration: 25, 
      color: 'bg-purple-500',
      status: 'In Progress'
    },
    { 
      name: 'Biometric Auth', 
      start: 35, 
      duration: 35, 
      color: 'bg-green-500',
      status: 'Planned'
    },
    { 
      name: 'AI Budget Coach', 
      start: 45, 
      duration: 40, 
      color: 'bg-orange-500',
      status: 'Planned'
    },
    { 
      name: 'Bill Split', 
      start: 50, 
      duration: 20, 
      color: 'bg-pink-500',
      status: 'Planned'
    },
  ];

  const defaultDependencies = [
    {
      from: 'AI Budget Coach',
      to: 'Biometric Auth',
      type: 'Blocking',
      description: 'Requires secure user authentication before accessing financial data'
    },
    {
      from: 'Investment Tracking',
      to: 'Plaid API v3',
      type: 'External Dependency',
      description: 'Waiting for Plaid API v3 release (Q1 2026)'
    }
  ];

  // Use roadmap data if available, otherwise use defaults
  const quarters = roadmapData.quarters.length > 0 ? roadmapData.quarters : defaultQuarters;
  const timelineView = roadmapData.timelineView.length > 0 ? roadmapData.timelineView : defaultTimelineView;
  const dependencies = roadmapData.dependencies.length > 0 ? roadmapData.dependencies : defaultDependencies;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Product Roadmap</h1>
          <p className="text-slate-600">Plan and track your product initiatives over time</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            type="button"
            onClick={handlePrioritizeRoadmap}
            disabled={prioritizing || !selectedRoadmap}
          >
            <Sparkles className="w-4 h-4" />
            {prioritizing ? 'Prioritizing...' : 'AI Prioritization'}
          </Button>
          <Button className="gap-2" type="button" onClick={() => navigate('/workspace/roadmap/create')}>
            <Plus className="w-4 h-4" />
            Add Roadmap
          </Button>
        </div>
      </div>

      {/* Roadmap Selector */}
      {roadmaps.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Select Roadmap</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {roadmaps.map((rm) => (
                <div 
                  key={rm.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedRoadmap?.id === rm.id 
                      ? 'bg-blue-50 border-blue-300 shadow-md' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedRoadmap(rm)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rm.title}</h4>
                      {selectedRoadmap?.id === rm.id && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                    {rm.description && <p className="text-slate-600 text-sm mt-1">{rm.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{rm.status || 'active'}</Badge>
                      {rm.start_date && <span className="text-slate-600 text-sm">Start: {rm.start_date.split('T')[0]}</span>}
                      {rm.end_date && <span className="text-slate-600 text-sm">End: {rm.end_date.split('T')[0]}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" type="button" onClick={() => navigate(`/workspace/roadmap/edit/${rm.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" type="button" onClick={() => handleDelete(rm.id)}>
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

      {/* Selected Roadmap Display */}
      {selectedRoadmap && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{selectedRoadmap.title}</h3>
            <Badge variant="default">{selectedRoadmap.status || 'active'}</Badge>
          </div>
          {selectedRoadmap.description && (
            <p className="text-slate-700 mb-2">{selectedRoadmap.description}</p>
          )}
          <div className="flex gap-4 text-sm text-slate-600">
            {selectedRoadmap.start_date && (
              <span>Start: {new Date(selectedRoadmap.start_date).toLocaleDateString()}</span>
            )}
            {selectedRoadmap.end_date && (
              <span>End: {new Date(selectedRoadmap.end_date).toLocaleDateString()}</span>
            )}
          </div>
        </Card>
      )}

      {!selectedRoadmap && roadmaps.length === 0 && !loading && (
        <Card className="p-6">
          <p className="text-slate-600 text-center">No roadmaps created yet. Create your first roadmap to get started!</p>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI Roadmap Recommendations</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Consider moving "Biometric Auth" to Q4 2025 - high customer demand (234 feedback mentions)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  "Investment Tracking" has dependency on "Plaid API v3" upgrade - adjust timeline
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Team capacity analysis suggests Q1 2026 is overallocated by 15%
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="ai">AI/ML</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-status">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="future">Future</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="priority">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* View Toggle */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <Layout className="w-4 h-4" />
            Kanban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          {/* Timeline View */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="mb-4">Timeline View</h3>
              <div className="flex gap-2 text-slate-500 mb-4">
                {roadmapData.startDate ? (
                  <>
                    <span>{new Date(roadmapData.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <span>→</span>
                    <span>{roadmapData.endDate ? new Date(roadmapData.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ongoing'}</span>
                  </>
                ) : (
                  <>
                    <span>Nov 2025</span>
                    <span>→</span>
                    <span>Dec 2026</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {timelineView.length > 0 ? (
                timelineView.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-48">{item.name}</span>
                      <Badge variant={item.status === 'In Progress' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute h-full ${item.color || 'bg-blue-500'} rounded-full`}
                        style={{
                          left: `${item.start || 0}%`,
                          width: `${item.duration || 10}%`
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">No timeline items. Add initiatives to see them on the timeline.</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-slate-500">
                <span>Q4 2025</span>
                <span>Q1 2026</span>
                <span>Q2 2026</span>
                <span>Q3 2026</span>
              </div>
            </div>
          </Card>

          {/* Dependencies */}
          <Card className="p-6">
            <h3 className="mb-4">Dependencies</h3>
            <div className="space-y-3">
              {dependencies.length > 0 ? (
                dependencies.map((dep, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span>{dep.from} → {dep.to}</span>
                      <Badge variant={dep.type === 'Blocking' ? 'secondary' : 'outline'}>
                        {dep.type}
                      </Badge>
                    </div>
                    {dep.description && (
                      <p className="text-slate-600">{dep.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">No dependencies defined.</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-6">
          {/* Kanban View */}
          {quarters.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-4">
              {quarters.map((quarter, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4>{quarter.name}</h4>
                    <Badge variant="secondary">{quarter.initiatives?.length || 0}</Badge>
                  </div>
                  <div className="space-y-3">
                    {quarter.initiatives?.map((initiative, initIndex) => (
                      <Card key={initIndex} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                        <h5 className="mb-2">{initiative.name}</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-slate-600">
                            <span>{initiative.team || 'Unassigned'}</span>
                            <Badge 
                              variant={
                                initiative.priority === 'High' ? 'destructive' : 
                                initiative.priority === 'Medium' ? 'secondary' : 'outline'
                              }
                            >
                              {initiative.priority || 'Medium'}
                            </Badge>
                          </div>
                          {(initiative.progress || 0) > 0 && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-500">Progress</span>
                                <span className="text-slate-600">{initiative.progress}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600"
                                  style={{width: `${initiative.progress}%`}}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                    <Button variant="ghost" className="w-full gap-2" type="button">
                      <Plus className="w-4 h-4" />
                      Add Initiative
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-slate-500 text-center py-8">No quarters/phases defined. Add phases to see them in the kanban view.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* AI Prioritization Dialog */}
      <Dialog open={showAIPrioritization} onOpenChange={setShowAIPrioritization}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Roadmap Prioritization
            </DialogTitle>
            <DialogDescription>
              AI-powered prioritization recommendations for your roadmap initiatives
            </DialogDescription>
          </DialogHeader>
          
          {aiPrioritization && (
            <div className="space-y-6 py-4">
              {/* Prioritized Initiatives */}
              {aiPrioritization.prioritized_initiatives && aiPrioritization.prioritized_initiatives.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Prioritized Initiatives</h4>
                  <div className="space-y-3">
                    {aiPrioritization.prioritized_initiatives.map((initiative: any, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                            {initiative.priority || index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium mb-1">{initiative.name}</h5>
                            {initiative.reasoning && (
                              <p className="text-sm text-slate-600">{initiative.reasoning}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact vs Effort Analysis */}
              {aiPrioritization.impact_effort_analysis && (
                <div>
                  <h4 className="font-semibold mb-2">Impact vs Effort Analysis</h4>
                  <p className="text-slate-700">{aiPrioritization.impact_effort_analysis}</p>
                </div>
              )}

              {/* Dependencies */}
              {aiPrioritization.dependencies && (
                <div>
                  <h4 className="font-semibold mb-2">Dependencies & Sequencing</h4>
                  <p className="text-slate-700">{aiPrioritization.dependencies}</p>
                </div>
              )}

              {/* Timeline */}
              {aiPrioritization.timeline && (
                <div>
                  <h4 className="font-semibold mb-2">Timeline Recommendations</h4>
                  <p className="text-slate-700">{aiPrioritization.timeline}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowAIPrioritization(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
