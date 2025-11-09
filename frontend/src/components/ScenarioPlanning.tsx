import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Play, Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function ScenarioPlanning() {
  const [budget, setBudget] = useState([1200]);
  const [headcount, setHeadcount] = useState([12]);
  const [timeDelay, setTimeDelay] = useState([0]);

  const scenarios = [
    {
      name: 'Current Plan',
      status: 'baseline',
      budget: 1200,
      headcount: 12,
      timeline: '12 months',
      features: 8,
      risk: 'Medium',
      outcome: 'Launch Q4 2025 with all features'
    },
    {
      name: 'Accelerated Launch',
      status: 'optimistic',
      budget: 1800,
      headcount: 18,
      timeline: '8 months',
      features: 6,
      risk: 'High',
      outcome: 'Early market entry, limited MVP'
    },
    {
      name: 'Budget Constrained',
      status: 'conservative',
      budget: 800,
      headcount: 8,
      timeline: '16 months',
      features: 5,
      risk: 'Low',
      outcome: 'Delayed but cost-effective'
    }
  ];

  const impacts = [
    {
      area: 'Time to Market',
      baseline: 12,
      current: Math.max(8, 12 + timeDelay[0] - Math.floor((headcount[0] - 12) / 3)),
      unit: 'months',
      impact: 'critical'
    },
    {
      area: 'Feature Completeness',
      baseline: 100,
      current: Math.min(100, (budget[0] / 1200) * 100),
      unit: '%',
      impact: 'high'
    },
    {
      area: 'Team Velocity',
      baseline: 45,
      current: Math.min(80, 45 + (headcount[0] - 12) * 2),
      unit: 'pts/sprint',
      impact: 'medium'
    },
    {
      area: 'Quality Score',
      baseline: 85,
      current: Math.max(60, 85 - Math.floor((headcount[0] - 12) / 2)),
      unit: '%',
      impact: 'high'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Scenario Planning Studio</h1>
          <p className="text-slate-600">Model different scenarios and understand their impact on your roadmap</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Recommendations
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Scenario
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI-Generated Scenario Insights</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
                <span className="text-slate-700">
                  Reducing headcount by 25% will delay launch by 4-6 months based on historical velocity
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 shrink-0 mt-1" />
                <span className="text-slate-700">
                  Adding 2 senior engineers could reduce timeline by 2 months with minimal quality impact
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
                <span className="text-slate-700">
                  Budget cuts below $1M risk cutting biometric auth feature (high customer demand)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="mb-6">Adjust Variables</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Budget (in thousands)</Label>
                  <span className="text-blue-600">${budget[0]}K</span>
                </div>
                <Slider 
                  value={budget} 
                  onValueChange={setBudget}
                  min={400}
                  max={2400}
                  step={100}
                  className="py-4"
                />
                <div className="flex justify-between text-slate-500">
                  <span>$400K</span>
                  <span>$2.4M</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Team Headcount</Label>
                  <span className="text-purple-600">{headcount[0]} people</span>
                </div>
                <Slider 
                  value={headcount} 
                  onValueChange={setHeadcount}
                  min={4}
                  max={24}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-slate-500">
                  <span>4 people</span>
                  <span>24 people</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Timeline Adjustment</Label>
                  <span className="text-green-600">
                    {timeDelay[0] > 0 ? `+${timeDelay[0]}` : timeDelay[0]} months
                  </span>
                </div>
                <Slider 
                  value={timeDelay} 
                  onValueChange={setTimeDelay}
                  min={-6}
                  max={12}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-slate-500">
                  <span>-6 months</span>
                  <span>+12 months</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t flex gap-3">
              <Button className="gap-2">
                <Play className="w-4 h-4" />
                Run Simulation
              </Button>
              <Button variant="outline">Reset to Baseline</Button>
            </div>
          </Card>

          {/* Impact Analysis */}
          <Card className="p-6">
            <h3 className="mb-6">Impact Analysis</h3>
            
            <div className="space-y-4">
              {impacts.map((impact, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span>{impact.area}</span>
                      <Badge variant="outline">{impact.impact}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-slate-500">Baseline</div>
                        <div>{impact.baseline}{impact.unit}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-500">Projected</div>
                        <div className={
                          impact.current > impact.baseline ? 'text-green-600' : 
                          impact.current < impact.baseline ? 'text-red-600' : ''
                        }>
                          {Math.round(impact.current)}{impact.unit}
                        </div>
                      </div>
                      {impact.current !== impact.baseline && (
                        impact.current > impact.baseline ? 
                          <TrendingUp className="w-5 h-5 text-green-600" /> :
                          <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        impact.current > impact.baseline ? 'bg-green-500' : 
                        impact.current < impact.baseline ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{width: `${Math.min((impact.current / impact.baseline) * 100, 100)}%`}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Roadmap Impact */}
          <Card className="p-6">
            <h3 className="mb-4">Roadmap Impact Simulation</h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>Mobile App Redesign</span>
                  <Badge>Q4 2025</Badge>
                </div>
                <p className="text-slate-600">Impact: Delayed by 1 month due to reduced headcount</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>Biometric Authentication</span>
                  <Badge variant="destructive">At Risk</Badge>
                </div>
                <p className="text-slate-600">Impact: May need to descope due to budget constraints</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>AI Budget Coach</span>
                  <Badge variant="secondary">On Track</Badge>
                </div>
                <p className="text-slate-600">Impact: No change to timeline or scope</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Saved Scenarios */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Saved Scenarios</h3>
            <div className="space-y-3">
              {scenarios.map((scenario, index) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    scenario.status === 'baseline' ? 'border-blue-300 bg-blue-50' : 'hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4>{scenario.name}</h4>
                    {scenario.status === 'baseline' && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span>${scenario.budget}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team:</span>
                      <span>{scenario.headcount} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span>{scenario.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Features:</span>
                      <span>{scenario.features} planned</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk:</span>
                      <Badge 
                        variant={
                          scenario.risk === 'High' ? 'destructive' : 
                          scenario.risk === 'Medium' ? 'secondary' : 'outline'
                        }
                      >
                        {scenario.risk}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-slate-700">{scenario.outcome}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Load
                    </Button>
                    <Button variant="ghost" size="sm">
                      Compare
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="mb-3">Quick Insights</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Current runway: 18 months at burn rate</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Break-even projected: Q2 2026</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Hiring bottleneck: Senior engineers</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
