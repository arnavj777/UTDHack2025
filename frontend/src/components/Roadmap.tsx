import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Plus, Calendar, Filter, Layout } from 'lucide-react';

export function Roadmap() {
  const quarters = [
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

  const timelineView = [
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

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Product Roadmap</h1>
          <p className="text-slate-600">Plan and track your product initiatives over time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Prioritization
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Initiative
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
                <span>Nov 2025</span>
                <span>→</span>
                <span>Dec 2026</span>
              </div>
            </div>

            <div className="space-y-4">
              {timelineView.map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-48">{item.name}</span>
                    <Badge variant={item.status === 'In Progress' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute h-full ${item.color} rounded-full`}
                      style={{
                        left: `${item.start}%`,
                        width: `${item.duration}%`
                      }}
                    />
                  </div>
                </div>
              ))}
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
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>AI Budget Coach → Biometric Auth</span>
                  <Badge variant="secondary">Blocking</Badge>
                </div>
                <p className="text-slate-600">Requires secure user authentication before accessing financial data</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>Investment Tracking → Plaid API v3</span>
                  <Badge variant="outline">External Dependency</Badge>
                </div>
                <p className="text-slate-600">Waiting for Plaid API v3 release (Q1 2026)</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-6">
          {/* Kanban View */}
          <div className="grid md:grid-cols-4 gap-4">
            {quarters.map((quarter, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4>{quarter.name}</h4>
                  <Badge variant="secondary">{quarter.initiatives.length}</Badge>
                </div>
                <div className="space-y-3">
                  {quarter.initiatives.map((initiative, initIndex) => (
                    <Card key={initIndex} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <h5 className="mb-2">{initiative.name}</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>{initiative.team}</span>
                          <Badge 
                            variant={
                              initiative.priority === 'High' ? 'destructive' : 
                              initiative.priority === 'Medium' ? 'secondary' : 'outline'
                            }
                          >
                            {initiative.priority}
                          </Badge>
                        </div>
                        {initiative.progress > 0 && (
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
                  <Button variant="ghost" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Add Initiative
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
