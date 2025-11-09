import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Sparkles, Plus, Search, Filter, ArrowUpDown, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { backlogItemService } from '../services/developmentService';
import { BacklogItem } from '../types/BacklogItem';
import { ApiError } from '../services/api';

export function BacklogManagement() {
  const navigate = useNavigate();
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBacklogItems();
  }, []);

  const loadBacklogItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await backlogItemService.list();
      setBacklogItems(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load backlog items. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this backlog item?')) return;
    try {
      await backlogItemService.delete(id);
      await loadBacklogItems();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete backlog item. Please try again.');
      }
    }
  };
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
          <Button className="gap-2" type="button" onClick={() => navigate('/workspace/backlog/create')}>
            <Plus className="w-4 h-4" />
            Add Backlog Item
          </Button>
        </div>
      </div>

      {/* Saved Backlog Items */}
      {backlogItems.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Backlog Items</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {backlogItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.description && <p className="text-slate-600 text-sm mt-1">{item.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{item.status || 'backlog'}</Badge>
                      <Badge variant="outline">{item.priority || 'medium'}</Badge>
                      {item.story_points && <span className="text-slate-600 text-sm">Points: {item.story_points}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => navigate(`/workspace/backlog/edit/${item.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" type="button" onClick={() => handleDelete(item.id)}>
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
          <div className="text-2xl">{backlogItems.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600 mb-1">Story Points</div>
          <div className="text-2xl">{backlogItems.reduce((sum, s) => sum + (s.story_points || 0), 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600 mb-1">In Sprint</div>
          <div className="text-2xl">{backlogItems.filter(s => s.data?.sprint).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-slate-600 mb-1">Ready</div>
          <div className="text-2xl">{backlogItems.filter(s => s.status === 'Ready' || s.status === 'ready').length}</div>
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
              {backlogItems.length > 0 ? (
                backlogItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-3">
                      <Checkbox />
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-blue-600">US-{item.id}</span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="mb-1">{item.title}</p>
                        <div className="flex gap-1">
                          {item.data?.labels && Array.isArray(item.data.labels) && item.data.labels.map((label: string, labelIndex: number) => (
                            <Badge key={labelIndex} variant="outline">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{item.data?.epic || '-'}</td>
                    <td className="p-3">
                      <Badge variant={getPriorityColor(item.priority || 'Medium')}>
                        {item.priority || 'Medium'}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono">{item.story_points || 0}</td>
                    <td className="p-3">
                      <Badge variant={item.status === 'In Progress' || item.status === 'in-progress' ? 'default' : 'secondary'}>
                        {item.status || 'Backlog'}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-600">
                      {item.data?.assignee || <span className="text-slate-400">Unassigned</span>}
                    </td>
                    <td className="p-3 text-slate-600">
                      {item.data?.sprint || <span className="text-slate-400">-</span>}
                    </td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" type="button">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/workspace/backlog/edit/${item.id}`)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Add to Sprint</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Sparkles className="w-4 h-4" />
                            Generate Acceptance Criteria
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-slate-500">
                    No backlog items found. Create your first backlog item!
                  </td>
                </tr>
              )}
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
