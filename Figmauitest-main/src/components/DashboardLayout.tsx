import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Sparkles, LayoutDashboard, Target, Lightbulb, TrendingUp, Maximize2,
  Map, ListTodo, FileText, CalendarDays, MessageSquare, BarChart3, 
  Users, BookOpen, Settings, Bell, Search, ChevronDown, LogOut, Wand2,
  Megaphone, PenTool, CheckSquare, Activity, Brain, FlaskConical, Zap,
  Workflow, Coffee
} from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export function DashboardLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/workspace/dashboard', icon: LayoutDashboard },
    { name: 'Daily Briefing', path: '/workspace/daily-briefing', icon: Coffee },
    { 
      label: 'Strategy & Ideation',
      items: [
        { name: 'Product Strategy', path: '/workspace/strategy', icon: Target },
        { name: 'Idea Repository', path: '/workspace/ideas', icon: Lightbulb },
        { name: 'Market Sizing', path: '/workspace/market-sizing', icon: TrendingUp },
        { name: 'Scenario Planning', path: '/workspace/scenario-planning', icon: Maximize2 },
      ]
    },
    { 
      label: 'Requirements & Development',
      items: [
        { name: 'Roadmap', path: '/workspace/roadmap', icon: Map },
        { name: 'Backlog', path: '/workspace/backlog', icon: ListTodo },
        { name: 'PRD Builder', path: '/workspace/prd', icon: FileText },
        { name: 'Sprint Planning', path: '/workspace/sprint-planning', icon: CalendarDays },
      ]
    },
    { 
      label: 'Design & Prototyping',
      items: [
        { name: 'Wireframe Generator', path: '/workspace/wireframe-generator', icon: Wand2 },
      ]
    },
    { 
      label: 'Go-to-Market',
      items: [
        { name: 'GTM Strategy', path: '/workspace/gtm-strategy', icon: Megaphone },
        { name: 'Content Studio', path: '/workspace/content-automation', icon: PenTool },
        { name: 'Launch Checklist', path: '/workspace/launch-checklist', icon: CheckSquare },
      ]
    },
    { 
      label: 'Analytics & Insights',
      items: [
        { name: 'Metrics Dashboard', path: '/workspace/metrics', icon: Activity },
        { name: 'AI Insights', path: '/workspace/ai-insights', icon: Brain },
        { name: 'Experiments', path: '/workspace/experiments', icon: FlaskConical },
      ]
    },
    { 
      label: 'Automation',
      items: [
        { name: 'AI Agent Control', path: '/workspace/ai-agent', icon: Sparkles },
        { name: 'Workflow Builder', path: '/workspace/workflow-automation', icon: Workflow },
      ]
    },
    { 
      label: 'Research & Intelligence',
      items: [
        { name: 'Customer Feedback', path: '/workspace/feedback', icon: MessageSquare },
        { name: 'Competitor Intel', path: '/workspace/competitors', icon: BarChart3 },
        { name: 'User Personas', path: '/workspace/personas', icon: Users },
        { name: 'Research Vault', path: '/workspace/research', icon: BookOpen },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <Link to="/workspace/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">ProductAI</span>
            </Link>
            
            <div className="hidden md:block w-px h-6 bg-slate-200" />
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search products, PRDs, ideas..." 
                className="pl-10 w-64 lg:w-96"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">John Doe</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p>John Doe</p>
                  <p className="text-slate-500">john@company.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  Team Management
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link to="/login">
                  <DropdownMenuItem>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] hidden lg:block">
          <nav className="p-4 space-y-6">
            {navigation.map((section, index) => (
              <div key={index}>
                {section.path ? (
                  // Single item
                  <Link to={section.path}>
                    <Button 
                      variant={isActive(section.path) ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      {section.icon && <section.icon className="w-4 h-4" />}
                      {section.name}
                    </Button>
                  </Link>
                ) : (
                  // Section with items
                  <div>
                    <div className="px-3 mb-2 text-slate-500 uppercase tracking-wide">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items?.map((item) => (
                        <Link key={item.path} to={item.path}>
                          <Button 
                            variant={isActive(item.path) ? 'secondary' : 'ghost'}
                            className="w-full justify-start gap-2"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* AI Credits Badge */}
          <div className="p-4 border-t mt-auto">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Credits</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">742 / 1,000</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{width: '74%'}} />
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto">
                Get more credits
              </Button>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
