import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Plus, Save, Download, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Separator } from './ui/separator';

export function PRDBuilder() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">PRD Builder</h1>
          <p className="text-slate-600">Create comprehensive Product Requirement Documents with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Fill Sections
          </Button>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* PRD Header */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-600">Feature Name</label>
                <Input 
                  placeholder="e.g., Biometric Authentication" 
                  defaultValue="Biometric Authentication"
                  className="text-xl"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-600">Owner</label>
                  <Select defaultValue="john">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="sarah">Sarah Chen</SelectItem>
                      <SelectItem value="michael">Michael Torres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-600">Status</label>
                  <Select defaultValue="draft">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-600">Target Release</label>
                  <Input type="date" defaultValue="2026-01-15" />
                </div>
              </div>
            </div>
          </Card>

          {/* PRD Sections */}
          <Tabs defaultValue="problem" className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="ux">UX/Design</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="scope">Scope</TabsTrigger>
            </TabsList>

            <TabsContent value="problem">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Problem Statement</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Generate
                  </Button>
                </div>
                <Textarea 
                  className="min-h-32 mb-4"
                  placeholder="What problem are we solving?"
                  defaultValue="Users are frustrated with slow and insecure password-based login. Industry data shows that 67% of users prefer biometric authentication for mobile banking apps, and our customer feedback indicates this is a top requested feature."
                />

                <Separator className="my-4" />

                <h4 className="mb-3">Customer Pain Points</h4>
                <ul className="space-y-2 mb-4">
                  {[
                    'Typing passwords on mobile is error-prone and time-consuming',
                    'Users forget passwords and require frequent resets',
                    'Security concerns about password storage and reuse',
                    'Competitors offer biometric auth - we\'re falling behind'
                  ].map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="mb-3">Supporting Data</h4>
                <Card className="p-4 bg-slate-50">
                  <ul className="space-y-2">
                    <li>• 234 customer feedback mentions requesting biometric auth</li>
                    <li>• 42% of login attempts fail due to incorrect passwords</li>
                    <li>• Password reset flow has 35% drop-off rate</li>
                    <li>• 5 of top 10 banking apps have biometric auth</li>
                  </ul>
                </Card>
              </Card>
            </TabsContent>

            <TabsContent value="goals">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Goals & Success Criteria</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Suggest
                  </Button>
                </div>

                <h4 className="mb-3">Primary Goals</h4>
                <div className="space-y-3 mb-6">
                  {[
                    { goal: 'Reduce login time by 70%', metric: 'Avg 2s vs 7s with password' },
                    { goal: 'Increase login success rate to 95%', metric: 'From current 58%' },
                    { goal: 'Improve user satisfaction (NPS)', metric: 'Target +15 points' }
                  ].map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="mb-1">{item.goal}</div>
                          <div className="text-slate-500">{item.metric}</div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </Card>
                  ))}
                </div>

                <h4 className="mb-3">Key Results</h4>
                <Textarea 
                  className="min-h-24"
                  defaultValue="- 80% of eligible users enable biometric auth within first month&#10;- Login failures drop from 42% to <5%&#10;- Password reset requests decrease by 60%&#10;- App store reviews mention improved login experience"
                />
              </Card>
            </TabsContent>

            <TabsContent value="requirements">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Functional Requirements</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Requirement
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'REQ-1',
                      title: 'Support Face ID on iOS devices',
                      priority: 'High',
                      status: 'Approved'
                    },
                    {
                      id: 'REQ-2',
                      title: 'Support fingerprint auth on Android devices',
                      priority: 'High',
                      status: 'Approved'
                    },
                    {
                      id: 'REQ-3',
                      title: 'Fallback to password if biometric fails',
                      priority: 'High',
                      status: 'Approved'
                    },
                    {
                      id: 'REQ-4',
                      title: 'Allow users to enable/disable biometric in settings',
                      priority: 'Medium',
                      status: 'In Review'
                    },
                    {
                      id: 'REQ-5',
                      title: 'Re-authenticate for sensitive transactions',
                      priority: 'High',
                      status: 'Approved'
                    }
                  ].map((req, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-blue-600">{req.id}</span>
                            <span>{req.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={req.priority === 'High' ? 'destructive' : 'secondary'}>
                            {req.priority}
                          </Badge>
                          <Badge variant={req.status === 'Approved' ? 'default' : 'outline'}>
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="ux">
              <Card className="p-6">
                <h3 className="mb-4">UX & Design Specifications</h3>

                <h4 className="mb-3">User Flow</h4>
                <div className="p-4 bg-slate-50 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">1</div>
                    <span>User opens app</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 ml-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">2</div>
                    <span>Biometric prompt appears</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 ml-8">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">3</div>
                    <span>User authenticates with Face ID/fingerprint</span>
                  </div>
                  <div className="flex items-center gap-2 ml-12">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                    <span>User gains access to app</span>
                  </div>
                </div>

                <h4 className="mb-3">Design Mockups</h4>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {['Login Screen', 'Biometric Prompt', 'Settings Toggle'].map((screen, index) => (
                    <Card key={index} className="aspect-video bg-slate-100 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <div className="w-12 h-12 mx-auto mb-2 border-2 border-dashed border-slate-300 rounded flex items-center justify-center">
                          +
                        </div>
                        <p>{screen}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Design Files
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card className="p-6">
                <h3 className="mb-4">Success Metrics</h3>

                <div className="space-y-4">
                  {[
                    { metric: 'Biometric Adoption Rate', target: '80%', current: '-', measurement: 'Weekly' },
                    { metric: 'Login Success Rate', target: '95%', current: '58%', measurement: 'Daily' },
                    { metric: 'Avg Login Time', target: '2s', current: '7s', measurement: 'Real-time' },
                    { metric: 'Password Reset Requests', target: '-60%', current: 'Baseline', measurement: 'Weekly' },
                    { metric: 'User Satisfaction (NPS)', target: '+15', current: '72', measurement: 'Monthly' }
                  ].map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-slate-600 mb-1">Metric</div>
                          <div>{item.metric}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">Target</div>
                          <div className="text-green-600">{item.target}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">Current</div>
                          <div>{item.current}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">Measurement</div>
                          <div>{item.measurement}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="scope">
              <Card className="p-6">
                <h3 className="mb-4">Scope & Timeline</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="mb-3 text-green-600">In Scope ✓</h4>
                    <ul className="space-y-2">
                      {[
                        'Face ID support (iOS)',
                        'Fingerprint support (Android)',
                        'Settings toggle',
                        'Fallback to password',
                        'Re-auth for transactions >$500'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 text-red-600">Out of Scope ✗</h4>
                    <ul className="space-y-2">
                      {[
                        'Voice authentication',
                        'Iris scanning',
                        'Multi-device sync',
                        'Biometric for web version',
                        'Third-party app integration'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="my-6" />

                <h4 className="mb-3">Timeline</h4>
                <div className="space-y-3">
                  {[
                    { phase: 'Design & Research', duration: '2 weeks', status: 'Completed' },
                    { phase: 'Development', duration: '6 weeks', status: 'In Progress' },
                    { phase: 'QA & Testing', duration: '2 weeks', status: 'Planned' },
                    { phase: 'Beta Launch', duration: '1 week', status: 'Planned' },
                    { phase: 'Full Rollout', duration: '2 weeks', status: 'Planned' }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        phase.status === 'Completed' ? 'bg-green-600' :
                        phase.status === 'In Progress' ? 'bg-blue-600' :
                        'bg-slate-300'
                      }`} />
                      <span className="flex-1">{phase.phase}</span>
                      <span className="text-slate-600">{phase.duration}</span>
                      <Badge variant={
                        phase.status === 'Completed' ? 'default' :
                        phase.status === 'In Progress' ? 'default' :
                        'outline'
                      }>
                        {phase.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compliance Check */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4>Compliance Status</h4>
            </div>
            <div className="space-y-3">
              {[
                { check: 'Security Review', status: 'Passed' },
                { check: 'Privacy Impact', status: 'Passed' },
                { check: 'Banking Regulations', status: 'Passed' },
                { check: 'Accessibility (WCAG)', status: 'In Review' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{item.check}</span>
                  <Badge variant={item.status === 'Passed' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Comments */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" />
              <h4>Comments</h4>
              <Badge variant="secondary">3</Badge>
            </div>
            <div className="space-y-3">
              {[
                { author: 'Sarah Chen', comment: 'Need to verify Android fingerprint SDK compatibility', time: '2h ago' },
                { author: 'Michael Torres', comment: 'Security team approved the approach', time: '5h ago' },
                { author: 'Jessica Kumar', comment: 'Updated metrics based on latest data', time: '1d ago' }
              ].map((comment, index) => (
                <div key={index} className="text-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <span>{comment.author}</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {comment.time}
                    </span>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Add Comment
            </Button>
          </Card>

          {/* Version History */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <h4>Version History</h4>
            </div>
            <div className="space-y-2 text-slate-600">
              <div>v1.3 - Current Draft</div>
              <div>v1.2 - Nov 5, 2025</div>
              <div>v1.1 - Nov 1, 2025</div>
              <div>v1.0 - Oct 28, 2025</div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4">
              View All Versions
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
