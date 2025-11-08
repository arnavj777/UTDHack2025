import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Sparkles, Plus, Search, Filter, ArrowUpDown, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function BacklogManagement() {
  const stories = [
    {
      id: 'US-101',
      title: 'As a user, I want to enable dark mode so that I can reduce eye strain',
      epic: 'Mobile App Redesign',
      priority: 'High',
      points: 8,
      status: 'Ready',
      assignee: 'Sarah Chen',
      sprint: 'Sprint 24',
      labels: ['UX', 'Accessibility']
    },
    {
      id: 'US-102',
      title: 'As a user, I want to log in with Face ID so that I can access my account securely',
      epic: 'Biometric Authentication',
      priority: 'High',
      points: 13,
      status: 'In Progress',
      assignee: 'Michael Torres',
      sprint: 'Sprint 24',
      labels: ['Security', 'iOS']
    },
    {
      id: 'US-103',
      title: 'As a user, I want to see my spending by category so that I can understand my habits',
      epic: 'AI Budget Coach',
      priority: 'Medium',
      points: 5,
      status: 'Ready',
      assignee: null,
      sprint: null,
      labels: ['Analytics', 'AI']
    },
    {
      id: 'US-104',
      title: 'As a user, I want to split bills with friends so that I can share expenses easily',
      epic: 'Bill Split Feature',
      priority: 'Medium',
      points: 8,
      status: 'Backlog',
      assignee: null,
      sprint: null,
      labels: ['Payments', 'Social']
    },
    {
      id: 'US-105',
      title: 'As a user, I want fingerprint auth on Android so that I can use biometric login',
      epic: 'Biometric Authentication',
      priority: 'High',
      points: 8,
      status: 'Ready',
      assignee: 'Jessica Kumar',
      sprint: 'Sprint 25',
      labels: ['Security', 'Android']
    },
    {
      id: 'US-106',
      title: 'As a user, I want to create savings goals so that I can track my progress',
      epic: 'Savings Goals v2',
      priority: 'Low',
      points: 13,
      status: 'Backlog',
      assignee: null,
      sprint: null,
      labels: ['Savings', 'Gamification']
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Backlog Management</h1>
          <p className="text-slate-600">Manage and prioritize your user stories and tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Grooming Assistant
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add User Story
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
            <h4 className="mb-2">AI Grooming Suggestions</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>US-103</strong> is similar to <strong>US-087</strong> - consider merging or linking
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>3 stories</strong> are missing acceptance criteria - AI can generate drafts
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Sprint 25 is under-allocated - consider adding US-104 (8 pts)
                </span>
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4">Apply Suggestions</Button>
          </div>
        </div>
      </Card>

      {/* Filters & Actions */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search user stories..." className="pl-10" />
          </div>
        </div>

        <Select defaultValue="all-epic">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-epic">All Epics</SelectItem>
            <SelectItem value="redesign">Mobile App Redesign</SelectItem>
            <SelectItem value="auth">Biometric Authentication</SelectItem>
            <SelectItem value="coach">AI Budget Coach</SelectItem>
            <SelectItem value="split">Bill Split Feature</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-status">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>

        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Sort
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-slate-600 mb-1">Total Stories</div>
          <div className="text-2xl">{stories.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600 mb-1">Story Points</div>
          <div className="text-2xl">{stories.reduce((sum, s) => sum + s.points, 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600 mb-1">In Sprint</div>
          <div className="text-2xl">{stories.filter(s => s.sprint).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600 mb-1">Ready</div>
          <div className="text-2xl">{stories.filter(s => s.status === 'Ready').length}</div>
        </Card>
      </div>

      {/* Backlog Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3 w-12">
                  <Checkbox />
                </th>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">User Story</th>
                <th className="text-left p-3">Epic</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Points</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Assignee</th>
                <th className="text-left p-3">Sprint</th>
                <th className="text-left p-3"></th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3">
                    <Checkbox />
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-blue-600">{story.id}</span>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="mb-1">{story.title}</p>
                      <div className="flex gap-1">
                        {story.labels.map((label, labelIndex) => (
                          <Badge key={labelIndex} variant="outline">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{story.epic}</td>
                  <td className="p-3">
                    <Badge variant={getPriorityColor(story.priority)}>
                      {story.priority}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono">{story.points}</td>
                  <td className="p-3">
                    <Badge variant={story.status === 'In Progress' ? 'default' : 'secondary'}>
                      {story.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-slate-600">
                    {story.assignee || <span className="text-slate-400">Unassigned</span>}
                  </td>
                  <td className="p-3 text-slate-600">
                    {story.sprint || <span className="text-slate-400">-</span>}
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Add to Sprint</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Sparkles className="w-4 h-4" />
                          Generate Acceptance Criteria
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bulk Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox />
            <span className="text-slate-600">Select all visible items</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Bulk Edit</Button>
            <Button variant="outline" size="sm">Add to Sprint</Button>
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Prioritize
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
