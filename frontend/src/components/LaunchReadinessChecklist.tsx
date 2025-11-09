import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Sparkles, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';

export function LaunchReadinessChecklist() {
  const categories = [
    {
      name: 'Quality Assurance',
      icon: CheckCircle,
      progress: 85,
      items: [
        { task: 'Unit tests passing', status: 'complete', owner: 'Engineering' },
        { task: 'Integration tests passing', status: 'complete', owner: 'Engineering' },
        { task: 'E2E tests passing', status: 'complete', owner: 'QA' },
        { task: 'Performance testing', status: 'complete', owner: 'QA' },
        { task: 'Security audit', status: 'in-progress', owner: 'Security Team' },
        { task: 'Accessibility testing', status: 'pending', owner: 'QA' },
        { task: 'Cross-browser testing', status: 'complete', owner: 'QA' }
      ]
    },
    {
      name: 'Documentation',
      icon: FileText,
      progress: 70,
      items: [
        { task: 'User documentation', status: 'complete', owner: 'Product' },
        { task: 'API documentation', status: 'complete', owner: 'Engineering' },
        { task: 'FAQ page', status: 'complete', owner: 'Support' },
        { task: 'Knowledge base articles', status: 'in-progress', owner: 'Support' },
        { task: 'Video tutorials', status: 'pending', owner: 'Marketing' },
        { task: 'Release notes', status: 'complete', owner: 'Product' }
      ]
    },
    {
      name: 'Support Preparation',
      icon: Users,
      progress: 60,
      items: [
        { task: 'Support team training', status: 'in-progress', owner: 'Support Lead' },
        { task: 'Escalation procedures', status: 'complete', owner: 'Support Lead' },
        { task: 'Known issues documented', status: 'complete', owner: 'Engineering' },
        { task: 'Support scripts created', status: 'pending', owner: 'Support' },
        { task: 'Chatbot updated', status: 'in-progress', owner: 'Support' }
      ]
    },
    {
      name: 'Marketing & Communications',
      icon: Megaphone,
      progress: 90,
      items: [
        { task: 'Launch blog post', status: 'complete', owner: 'Marketing' },
        { task: 'Social media posts', status: 'complete', owner: 'Marketing' },
        { task: 'Email campaign', status: 'complete', owner: 'Marketing' },
        { task: 'Press release', status: 'complete', owner: 'PR' },
        { task: 'Sales enablement materials', status: 'complete', owner: 'Sales' },
        { task: 'In-app announcements', status: 'in-progress', owner: 'Product' }
      ]
    },
    {
      name: 'Technical Infrastructure',
      icon: Server,
      progress: 95,
      items: [
        { task: 'Production deployment tested', status: 'complete', owner: 'DevOps' },
        { task: 'Monitoring & alerts configured', status: 'complete', owner: 'DevOps' },
        { task: 'Rollback plan documented', status: 'complete', owner: 'Engineering' },
        { task: 'Load testing completed', status: 'complete', owner: 'DevOps' },
        { task: 'Database migrations tested', status: 'complete', owner: 'Engineering' },
        { task: 'Feature flags configured', status: 'in-progress', owner: 'Engineering' }
      ]
    },
    {
      name: 'Compliance & Legal',
      icon: Shield,
      progress: 100,
      items: [
        { task: 'Privacy policy updated', status: 'complete', owner: 'Legal' },
        { task: 'Terms of service reviewed', status: 'complete', owner: 'Legal' },
        { task: 'GDPR compliance verified', status: 'complete', owner: 'Legal' },
        { task: 'Banking regulations checked', status: 'complete', owner: 'Compliance' },
        { task: 'Data protection assessment', status: 'complete', owner: 'Security' }
      ]
    }
  ];

  const risks = [
    {
      risk: 'Android fragmentation may cause issues on older devices',
      severity: 'Medium',
      mitigation: 'Implemented graceful fallback to password login',
      probability: '30%'
    },
    {
      risk: 'Higher than expected support volume in first week',
      severity: 'Low',
      mitigation: 'Support team trained, extra staff scheduled',
      probability: '50%'
    },
    {
      risk: 'Biometric enrollment rate lower than expected',
      severity: 'Medium',
      mitigation: 'In-app tutorial and email campaign prepared',
      probability: '40%'
    }
  ];

  const overallProgress = categories.reduce((sum, cat) => sum + cat.progress, 0) / categories.length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Launch Readiness Checklist</h1>
          <p className="text-slate-600">Track all launch requirements and ensure nothing is missed</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Risk Assessment
          </Button>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Overall Launch Readiness</h3>
          <div className="text-3xl">{Math.round(overallProgress)}%</div>
        </div>
        <Progress value={overallProgress} className="mb-4" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-1">
              {categories.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'complete').length, 0)}
            </div>
            <div className="text-slate-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-1">
              {categories.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'in-progress').length, 0)}
            </div>
            <div className="text-slate-600">In Progress</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-1">
              {categories.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'pending').length, 0)}
            </div>
            <div className="text-slate-600">Pending</div>
          </div>
        </div>
      </Card>

      {/* AI Risk Assessment */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI Launch Risk Assessment</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Go Signals</span>
                </div>
                <ul className="space-y-1 text-slate-700">
                  <li>• All critical bugs resolved</li>
                  <li>• Security audit passed</li>
                  <li>• Support team trained</li>
                  <li>• Infrastructure load-tested</li>
                </ul>
              </Card>
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span>Watch Items</span>
                </div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Accessibility testing incomplete</li>
                  <li>• Video tutorials not ready</li>
                  <li>• Feature flags still being configured</li>
                </ul>
              </Card>
            </div>
            <div className="mt-4 p-3 bg-white rounded border-l-4 border-green-600">
              <p className="text-green-900">
                <strong>Recommendation:</strong> Ready to launch on January 15th. Remaining items are non-blocking and can be completed post-launch.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Checklist Categories */}
      <div className="space-y-4">
        {categories.map((category, catIndex) => (
          <Card key={catIndex} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <category.icon className="w-6 h-6 text-blue-600" />
                <h3>{category.name}</h3>
                <Badge variant={category.progress === 100 ? 'default' : 'secondary'}>
                  {category.progress}%
                </Badge>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            <Progress value={category.progress} className="mb-4" />

            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox 
                      checked={item.status === 'complete'}
                      disabled={item.status !== 'complete'}
                    />
                    <div className="flex-1">
                      <div className={item.status === 'complete' ? 'line-through text-slate-500' : ''}>
                        {item.task}
                      </div>
                      <div className="text-slate-500">Owner: {item.owner}</div>
                    </div>
                  </div>
                  <div>
                    {item.status === 'complete' && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Complete
                      </Badge>
                    )}
                    {item.status === 'in-progress' && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </Badge>
                    )}
                    {item.status === 'pending' && (
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Risk Register */}
      <Card className="p-6">
        <h3 className="mb-4">Risk Register</h3>
        <div className="space-y-3">
          {risks.map((risk, index) => (
            <Card key={index} className="p-4 border-l-4 border-orange-400">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4>{risk.risk}</h4>
                    <Badge variant={
                      risk.severity === 'High' ? 'destructive' :
                      risk.severity === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {risk.severity}
                    </Badge>
                  </div>
                  <div className="text-slate-600 mb-2">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </div>
                  <div className="text-slate-500">
                    Probability: {risk.probability}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Add missing icon imports
import { Megaphone, Server, Shield, Users } from 'lucide-react';
