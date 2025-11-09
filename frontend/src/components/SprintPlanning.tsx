import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Sparkles, Plus, Calendar, AlertTriangle, TrendingUp, Users, Edit, Trash2 } from 'lucide-react';
import { sprintService } from '../services/developmentService';
import { Sprint } from '../types/Sprint';
import { ApiError } from '../services/api';
import { aiService } from '../services/aiService';
import { toast } from './ui/use-toast';

export function SprintPlanning() {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [planning, setPlanning] = useState(false);
  const [showAIPlan, setShowAIPlan] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(null);

  useEffect(() => {
    loadSprints();
  }, []);

  const loadSprints = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await sprintService.list();
      setSprints(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load sprints. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sprint?')) return;
    try {
      await sprintService.delete(id);
      await loadSprints();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete sprint. Please try again.');
      }
    }
  };

  const handlePlanSprint = async () => {
    try {
      setPlanning(true);
      const response = await aiService.planSprint([], 21);
      const plan = response.data || response;
      
      setAiPlan(plan);
      setShowAIPlan(true);
      
      toast({
        title: "AI Sprint Planning Generated",
        description: "View the full sprint plan in the dialog",
      });
    } catch (err: any) {
      console.error('Error planning sprint:', err);
      const errorMessage = err instanceof ApiError ? err.message : (err.message || 'Failed to plan sprint. Please try again.');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPlanning(false);
    }
  };

  const currentSprint = {
    number: 24,
    startDate: '2025-11-10',
    endDate: '2025-11-23',
    capacity: 65,
    committed: 58,
    completed: 42,
    team: 8
  };

  const teamMembers = [
    { name: 'Sarah Chen', role: 'Frontend Dev', capacity: 8, assigned: 8, velocity: 7.5 },
    { name: 'Michael Torres', role: 'Backend Dev', capacity: 8, assigned: 13, velocity: 8.2 },
    { name: 'Jessica Kumar', role: 'Full Stack', capacity: 8, assigned: 8, velocity: 6.9 },
    { name: 'Alex Johnson', role: 'Frontend Dev', capacity: 8, assigned: 5, velocity: 7.8 },
    { name: 'Maria Garcia', role: 'QA Engineer', capacity: 8, assigned: 8, velocity: 8.0 },
    { name: 'David Kim', role: 'Backend Dev', capacity: 8, assigned: 8, velocity: 7.3 },
    { name: 'Emma Wilson', role: 'Designer', capacity: 5, assigned: 5, velocity: 5.0 },
    { name: 'Tom Brown', role: 'DevOps', capacity: 8, assigned: 3, velocity: 7.5 }
  ];

  const stories = [
    { id: 'US-101', title: 'Dark mode toggle', points: 8, assignee: 'Sarah Chen', status: 'In Progress' },
    { id: 'US-102', title: 'Face ID integration', points: 13, assignee: 'Michael Torres', status: 'In Progress' },
    { id: 'US-103', title: 'Spending analytics', points: 5, assignee: 'Jessica Kumar', status: 'Blocked' },
    { id: 'US-104', title: 'Bill split UI', points: 8, assignee: 'Sarah Chen', status: 'To Do' },
    { id: 'US-105', title: 'Android fingerprint', points: 8, assignee: 'Jessica Kumar', status: 'In Progress' },
    { id: 'US-106', title: 'Settings redesign', points: 8, assignee: 'Emma Wilson', status: 'In Review' },
    { id: 'US-107', title: 'API optimization', points: 8, assignee: 'David Kim', status: 'In Progress' }
  ];

  const risks = [
    {
      type: 'warning',
      title: 'Michael Torres over-allocated',
      description: 'Assigned 13 pts vs 8 pt capacity. Consider redistributing work.',
      severity: 'High'
    },
    {
      type: 'info',
      title: 'Low story point coverage',
      description: '58 pts committed vs 65 pt capacity. Room to add 1-2 more stories.',
      severity: 'Low'
    },
    {
      type: 'warning',
      title: 'US-103 blocked',
      description: 'Waiting on analytics service deployment. May slip to next sprint.',
      severity: 'Medium'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Sprint Planning</h1>
          <p className="text-slate-600">Plan and manage your sprints</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => navigate('/workspace/sprint-planning/create')}>
            <Plus className="w-4 h-4" />
            Add Sprint
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            type="button"
            onClick={handlePlanSprint}
            disabled={planning}
          >
            <Sparkles className="w-4 h-4" />
            {planning ? 'Planning...' : 'AI Recommendations'}
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Story
          </Button>
        </div>
      </div>

      {/* Saved Sprints */}
      {sprints.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Sprints</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {sprints.map((sprint) => (
                <div key={sprint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{sprint.title}</h4>
                    {sprint.description && <p className="text-slate-600 text-sm mt-1">{sprint.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{sprint.status || 'planned'}</Badge>
                      {sprint.start_date && <span className="text-slate-600 text-sm">Start: {sprint.start_date.split('T')[0]}</span>}
                      {sprint.end_date && <span className="text-slate-600 text-sm">End: {sprint.end_date.split('T')[0]}</span>}
                      {sprint.velocity && <span className="text-slate-600 text-sm">Velocity: {sprint.velocity}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/sprint-planning/edit/${sprint.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(sprint.id)}>
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

      {/* AI Planning Assistant */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI Sprint Planning Suggestions</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Based on team velocity (avg 7.4 pts/person), recommend committing to 59 story points
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Suggest adding US-108 (5 pts) - aligns with sprint goals and Sarah has capacity
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Historical data shows 12% slippage on 13-point stories - consider splitting US-102
                </span>
              </li>
            </ul>
            <Button variant="outline" size="sm">Apply Recommendations</Button>
          </div>
        </div>
      </Card>

      {/* Sprint Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Team Capacity</div>
          <div className="text-3xl mb-2">{currentSprint.capacity} pts</div>
          <Progress value={(currentSprint.committed / currentSprint.capacity) * 100} />
          <div className="text-slate-500 mt-2">{currentSprint.committed} pts committed</div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Velocity Forecast</div>
          <div className="text-3xl mb-2">
            {((teamMembers.reduce((sum, m) => sum + m.velocity, 0))).toFixed(0)} pts
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+8% vs last sprint</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Stories</div>
          <div className="text-3xl mb-2">{stories.length}</div>
          <div className="text-slate-500">
            {stories.filter(s => s.status === 'In Progress').length} in progress
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Risk Level</div>
          <div className="text-3xl mb-2">
            <Badge variant="secondary">Medium</Badge>
          </div>
          <div className="text-slate-500">{risks.length} warnings detected</div>
        </Card>
      </div>

      {/* Risks & Warnings */}
      {risks.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Risks & Warnings</h3>
          <div className="space-y-3">
            {risks.map((risk, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  risk.severity === 'High' ? 'bg-red-50 border-red-200' :
                  risk.severity === 'Medium' ? 'bg-orange-50 border-orange-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    risk.severity === 'High' ? 'text-red-600' :
                    risk.severity === 'Medium' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{risk.title}</h4>
                      <Badge variant={
                        risk.severity === 'High' ? 'destructive' :
                        risk.severity === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="text-slate-600">{risk.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sprint Backlog */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Sprint Backlog</h3>
              <Button variant="outline" size="sm">View All Stories</Button>
            </div>

            <div className="space-y-3">
              {stories.map((story, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-blue-600">{story.id}</span>
                        <span>{story.title}</span>
                      </div>
                      <div className="text-slate-600">
                        Assigned to: {story.assignee}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">{story.points} pts</span>
                      <Badge variant={
                        story.status === 'In Progress' ? 'default' :
                        story.status === 'Blocked' ? 'destructive' :
                        story.status === 'In Review' ? 'secondary' : 'outline'
                      }>
                        {story.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Capacity */}
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h3>Team Capacity</h3>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div>{member.name}</div>
                      <div className="text-slate-500">{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className={member.assigned > member.capacity ? 'text-red-600' : ''}>
                        {member.assigned} / {member.capacity} pts
                      </div>
                      <div className="text-slate-500">
                        Velocity: {member.velocity}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(member.assigned / member.capacity) * 100} 
                    className={member.assigned > member.capacity ? 'bg-red-100' : ''}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Sprint Goals */}
          <Card className="p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" />
              <h4>Sprint Goals</h4>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Complete dark mode implementation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Launch biometric auth beta</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Finalize bill split UX design</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* AI Sprint Planning Dialog */}
      <Dialog open={showAIPlan} onOpenChange={setShowAIPlan}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Sprint Planning Recommendations
            </DialogTitle>
            <DialogDescription>
              AI-powered sprint planning suggestions and recommendations
            </DialogDescription>
          </DialogHeader>
          
          {aiPlan && (
            <div className="space-y-6 py-4">
              {aiPlan.sprint_goal && (
                <div>
                  <h4 className="font-semibold mb-2">Sprint Goal</h4>
                  <p className="text-slate-700">{aiPlan.sprint_goal}</p>
                </div>
              )}

              {aiPlan.recommended_stories && aiPlan.recommended_stories.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recommended Stories</h4>
                  <div className="space-y-2">
                    {aiPlan.recommended_stories.map((story: any, index: number) => (
                      <Card key={index} className="p-3">
                        {typeof story === 'string' ? (
                          <p className="text-slate-700">{story}</p>
                        ) : (
                          <>
                            {story.title && <h5 className="font-medium mb-1">{story.title}</h5>}
                            {story.points && <Badge variant="outline">{story.points} points</Badge>}
                          </>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {aiPlan.capacity_analysis && (
                <div>
                  <h4 className="font-semibold mb-2">Capacity Analysis</h4>
                  <p className="text-slate-700">{aiPlan.capacity_analysis}</p>
                </div>
              )}

              {aiPlan.risks && (
                <div>
                  <h4 className="font-semibold mb-2">Risks & Considerations</h4>
                  {Array.isArray(aiPlan.risks) ? (
                    <ul className="space-y-1">
                      {aiPlan.risks.map((risk: string, index: number) => (
                        <li key={index} className="text-slate-700">• {risk}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-700">{aiPlan.risks}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowAIPlan(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
