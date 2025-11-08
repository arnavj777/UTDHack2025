import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Plus, Play, Pause, Trash, Copy } from 'lucide-react';

export function WorkflowAutomationBuilder() {
  const workflows = [
    {
      name: 'Jira Story Sync',
      trigger: 'When Jira ticket moves to "In Review"',
      actions: ['Generate summary', 'Post to #product-updates Slack', 'Email stakeholders'],
      status: 'active',
      runs: 234
    },
    {
      name: 'Sprint Completion Report',
      trigger: 'When sprint ends',
      actions: ['Calculate velocity', 'Generate report', 'Send to team', 'Update roadmap'],
      status: 'active',
      runs: 12
    },
    {
      name: 'Risk Alert Pipeline',
      trigger: 'When velocity drops >15%',
      actions: ['Analyze causes', 'Create alert', 'Notify PM', 'Suggest mitigations'],
      status: 'paused',
      runs: 8
    }
  ];

  const suggestedWorkflows = [
    {
      name: 'Feedback Digest',
      description: 'Daily summary of customer feedback mentions by feature',
      estimated: '2.5 hrs/week saved'
    },
    {
      name: 'Blocker Escalation',
      description: 'Auto-escalate blockers that remain unresolved for 48 hours',
      estimated: '1.5 hrs/week saved'
    },
    {
      name: 'Release Note Generator',
      description: 'Auto-generate release notes from completed stories',
      estimated: '3 hrs/week saved'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Workflow Automation Builder</h1>
          <p className="text-slate-600">Create custom automations with drag-and-drop logic</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Workflow
        </Button>
      </div>

      {/* AI Suggestions */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-3">AI-Suggested Automations</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {suggestedWorkflows.map((workflow, index) => (
                <Card key={index} className="p-4 bg-white">
                  <h5 className="mb-2">{workflow.name}</h5>
                  <p className="text-slate-600 mb-3">{workflow.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{workflow.estimated}</Badge>
                    <Button size="sm" variant="outline">Create</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Active Workflows */}
      <Card className="p-6">
        <h3 className="mb-4">Active Workflows</h3>
        <div className="space-y-4">
          {workflows.map((workflow, index) => (
            <Card key={index} className="p-6 border-l-4 border-blue-600">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4>{workflow.name}</h4>
                    <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="text-slate-600">Executed {workflow.runs} times</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-24 text-slate-600">Trigger:</div>
                  <Card className="flex-1 p-3 bg-purple-50 border-purple-200">
                    {workflow.trigger}
                  </Card>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 text-slate-600">Actions:</div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {workflow.actions.map((action, actionIndex) => (
                      <Card key={actionIndex} className="p-3 bg-blue-50 border-blue-200">
                        {actionIndex + 1}. {action}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button variant="outline" size="sm">Edit Workflow</Button>
                <Button variant="outline" size="sm">View History</Button>
                <Button variant="outline" size="sm">Test Run</Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Workflow Builder */}
      <Card className="p-6">
        <h3 className="mb-4">Build New Workflow</h3>
        
        <div className="space-y-6">
          <div>
            <label className="mb-2 block">1. Choose Trigger</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a trigger..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jira-move">When Jira ticket moves</SelectItem>
                <SelectItem value="sprint-end">When sprint ends</SelectItem>
                <SelectItem value="story-create">When user story is created</SelectItem>
                <SelectItem value="velocity-drop">When velocity drops</SelectItem>
                <SelectItem value="feedback-received">When feedback is received</SelectItem>
                <SelectItem value="schedule">On a schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label>2. Add Actions</label>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Action
              </Button>
            </div>
            <div className="space-y-2 p-4 border-2 border-dashed border-slate-300 rounded-lg min-h-32 flex items-center justify-center text-slate-400">
              Drag actions here or click "Add Action"
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h5 className="mb-3">Available Actions</h5>
              <div className="space-y-2">
                {[
                  'Generate summary',
                  'Send email',
                  'Post to Slack',
                  'Create Jira ticket',
                  'Update roadmap',
                  'Notify stakeholders',
                  'Run AI analysis',
                  'Export report'
                ].map((action, index) => (
                  <div key={index} className="p-2 border rounded cursor-move hover:bg-blue-50 transition-colors">
                    {action}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h5 className="mb-3">Conditions (Optional)</h5>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
                <p className="text-slate-500">Add filters to control when this workflow runs</p>
              </div>
            </Card>
          </div>

          <div className="flex gap-2">
            <Button>Save Workflow</Button>
            <Button variant="outline">Test Run</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Active Workflows</div>
          <div className="text-3xl">{workflows.filter(w => w.status === 'active').length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Total Executions</div>
          <div className="text-3xl">{workflows.reduce((sum, w) => sum + w.runs, 0)}</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Time Saved</div>
          <div className="text-3xl">22 hrs</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Success Rate</div>
          <div className="text-3xl">98%</div>
        </Card>
      </div>
    </div>
  );
}
