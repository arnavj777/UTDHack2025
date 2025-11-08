import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Sparkles, Settings, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function AIAgentControlCenter() {
  const [autonomyLevel, setAutonomyLevel] = useState([50]);

  const automationCapabilities = [
    {
      category: 'Story & Requirements',
      items: [
        { name: 'Auto-draft user stories from ideas', enabled: true, frequency: 'When idea approved' },
        { name: 'Generate acceptance criteria', enabled: true, frequency: 'When story created' },
        { name: 'Suggest story point estimates', enabled: true, frequency: 'Real-time' },
        { name: 'Detect duplicate stories', enabled: true, frequency: 'Continuous' }
      ]
    },
    {
      category: 'Communication & Updates',
      items: [
        { name: 'Send sprint summary emails', enabled: true, frequency: 'End of sprint' },
        { name: 'Post standup summaries to Slack', enabled: false, frequency: 'Daily at 9 AM' },
        { name: 'Notify stakeholders of delays', enabled: true, frequency: 'When detected' },
        { name: 'Generate weekly status reports', enabled: true, frequency: 'Friday 4 PM' }
      ]
    },
    {
      category: 'Risk Detection',
      items: [
        { name: 'Flag scope creep', enabled: true, frequency: 'Real-time' },
        { name: 'Identify blockers', enabled: true, frequency: 'Continuous' },
        { name: 'Detect capacity issues', enabled: true, frequency: 'Sprint planning' },
        { name: 'Monitor velocity trends', enabled: true, frequency: 'Daily' }
      ]
    },
    {
      category: 'Roadmap & Planning',
      items: [
        { name: 'Suggest priority adjustments', enabled: false, frequency: 'Weekly' },
        { name: 'Identify roadmap conflicts', enabled: true, frequency: 'When items added' },
        { name: 'Recommend story sequencing', enabled: true, frequency: 'Sprint planning' },
        { name: 'Update timelines based on velocity', enabled: false, frequency: 'After each sprint' }
      ]
    }
  ];

  const recentActions = [
    { action: 'Generated acceptance criteria for US-127', time: '5 min ago', type: 'auto' },
    { action: 'Sent sprint summary to team@company.com', time: '2 hours ago', type: 'auto' },
    { action: 'Flagged scope creep in "Payment Gateway" epic', time: '3 hours ago', type: 'alert' },
    { action: 'Created user story draft from idea "Dark Mode"', time: '1 day ago', type: 'auto' }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">AI Agent Control Center</h1>
          <p className="text-slate-600">Configure what your AI assistant can automate</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Advanced Settings
        </Button>
      </div>

      {/* Autonomy Level */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-4">Agent Autonomy Level</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Manual</span>
                <span className="font-medium">
                  {autonomyLevel[0] < 33 ? 'Manual' : autonomyLevel[0] < 67 ? 'Semi-Automatic' : 'Full Auto'}
                </span>
                <span>Full Auto</span>
              </div>
              <Slider 
                value={autonomyLevel} 
                onValueChange={setAutonomyLevel}
                min={0}
                max={100}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-slate-600">
                <span>AI suggests only</span>
                <span>AI suggests & acts with approval</span>
                <span>AI acts automatically</span>
              </div>
            </div>

            <Card className="p-4 bg-white">
              <h4 className="mb-2">Current Mode: {autonomyLevel[0] < 33 ? '🔵 Manual' : autonomyLevel[0] < 67 ? '🟡 Semi-Automatic' : '🟢 Full Auto'}</h4>
              <p className="text-slate-700">
                {autonomyLevel[0] < 33 
                  ? 'AI will only suggest actions and wait for your approval before doing anything.'
                  : autonomyLevel[0] < 67 
                  ? 'AI will automatically handle routine tasks but ask for approval on important decisions.'
                  : 'AI will autonomously manage most tasks, only escalating critical issues to you.'}
              </p>
            </Card>
          </div>
        </div>
      </Card>

      {/* Automation Capabilities */}
      <div className="space-y-4">
        {automationCapabilities.map((category, catIndex) => (
          <Card key={catIndex} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3>{category.category}</h3>
              <Badge variant="secondary">
                {category.items.filter(i => i.enabled).length} / {category.items.length} enabled
              </Badge>
            </div>

            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-4 border rounded hover:bg-slate-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{item.name}</span>
                      {item.enabled && (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="text-slate-500">Frequency: {item.frequency}</div>
                  </div>
                  <Switch checked={item.enabled} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Recent AI Actions</h3>
        <div className="space-y-3">
          {recentActions.map((action, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border rounded">
              {action.type === 'auto' ? (
                <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div>{action.action}</div>
                <div className="text-slate-500">{action.time}</div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">View All Actions</Button>
      </Card>

      {/* Safety Controls */}
      <Card className="p-6">
        <h3 className="mb-4">Safety Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded">
            <div>
              <div className="mb-1">Require approval for high-priority changes</div>
              <div className="text-slate-600">AI will always ask before modifying high-priority items</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded">
            <div>
              <div className="mb-1">Limit external communications</div>
              <div className="text-slate-600">Prevent AI from sending emails outside the organization</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded">
            <div>
              <div className="mb-1">Review mode for new automations</div>
              <div className="text-slate-600">Show AI suggestions for 7 days before auto-executing</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Time Saved (30d)</div>
          <div className="text-3xl">14.5 hrs</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Actions Taken</div>
          <div className="text-3xl">342</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Accuracy Rate</div>
          <div className="text-3xl">96%</div>
        </Card>
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Manual Overrides</div>
          <div className="text-3xl">12</div>
        </Card>
      </div>
    </div>
  );
}
