import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Sparkles, Plus, Users, TrendingUp, DollarSign, Target, Edit, Trash2 } from 'lucide-react';
import { userPersonaService } from '../services/researchService';
import { UserPersona } from '../types/UserPersona';
import { ApiError } from '../services/api';

export function PersonaManager() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<UserPersona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userPersonaService.list();
      setPersonas(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load user personas. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user persona?')) return;
    try {
      await userPersonaService.delete(id);
      await loadPersonas();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete user persona. Please try again.');
      }
    }
  };
  const mockPersonas = [
    {
      name: 'Tech-Savvy Millennial',
      avatar: '👨‍💻',
      age: '28-35',
      income: '$65K-$95K',
      occupation: 'Software Engineer',
      location: 'Urban',
      percentage: 35,
      goals: [
        'Automate finances',
        'Maximize savings',
        'Track investments',
        'Quick mobile access'
      ],
      painPoints: [
        'Traditional banks are slow',
        'Frustrated by manual processes',
        'Wants cutting-edge features',
        'Security concerns with passwords'
      ],
      behaviors: [
        'Uses app 3-5x daily',
        'Prefers dark mode',
        'Expects instant notifications',
        'High adoption of new features'
      ],
      preferences: {
        channel: 'Mobile App (95%)',
        communication: 'Push notifications',
        supportTime: 'Evening & weekends'
      }
    },
    {
      name: 'Budget-Conscious Parent',
      avatar: '👩‍👧',
      age: '32-45',
      income: '$55K-$75K',
      occupation: 'Teacher / Healthcare',
      location: 'Suburban',
      percentage: 28,
      goals: [
        'Save for children\'s future',
        'Manage household budget',
        'No hidden fees',
        'Family bill management'
      ],
      painPoints: [
        'Complicated fee structures',
        'Lack of savings visibility',
        'Time-consuming budgeting',
        'Need family-friendly features'
      ],
      behaviors: [
        'Checks app 1-2x daily',
        'Uses savings goals heavily',
        'Reviews spending weekly',
        'Moderate feature adoption'
      ],
      preferences: {
        channel: 'Mobile App (75%), Web (25%)',
        communication: 'Email & SMS',
        supportTime: 'Morning & lunch'
      }
    },
    {
      name: 'Early Career Professional',
      avatar: '🎓',
      age: '22-27',
      income: '$40K-$60K',
      occupation: 'Entry-level roles',
      location: 'Urban',
      percentage: 22,
      goals: [
        'Build credit score',
        'Pay off student loans',
        'Learn money management',
        'Social payment features'
      ],
      painPoints: [
        'Low financial literacy',
        'Overwhelmed by options',
        'Need guidance & education',
        'Living paycheck to paycheck'
      ],
      behaviors: [
        'Uses app 2-3x daily',
        'High social feature usage',
        'Needs educational content',
        'Mobile-first mindset'
      ],
      preferences: {
        channel: 'Mobile App (90%)',
        communication: 'In-app messages',
        supportTime: 'Afternoon & evening'
      }
    },
    {
      name: 'Gig Economy Worker',
      avatar: '🚗',
      age: '25-40',
      income: '$35K-$70K (variable)',
      occupation: 'Freelance / Contract',
      location: 'Mixed',
      percentage: 15,
      goals: [
        'Manage irregular income',
        'Fast access to funds',
        'Expense tracking for taxes',
        'Multiple income streams'
      ],
      painPoints: [
        'Income unpredictability',
        'Tax complexity',
        'Need instant deposits',
        'Traditional banks don\'t understand needs'
      ],
      behaviors: [
        'Daily transaction checks',
        'Heavy reliance on instant access',
        'Uses multiple apps',
        'Price-sensitive'
      ],
      preferences: {
        channel: 'Mobile App (100%)',
        communication: 'Push notifications',
        supportTime: 'Any time (flexible)'
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">User Persona Manager</h1>
          <p className="text-slate-600">Dynamic personas that evolve with your customer data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Persona Insights
          </Button>
          <Button className="gap-2" onClick={() => navigate('/workspace/personas/create')}>
            <Plus className="w-4 h-4" />
            Add Persona
          </Button>
        </div>
      </div>

      {/* Saved User Personas */}
      {personas.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved User Personas</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {personas.map((persona) => (
                <div key={persona.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{persona.title}</h4>
                    {persona.description && <p className="text-slate-600 text-sm mt-1">{persona.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{persona.persona_name || 'Unnamed'}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/personas/edit/${persona.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(persona.id)}>
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
            <h4 className="mb-2">AI-Generated Persona Updates</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>Tech-Savvy Millennial segment growing 12%</strong> - consider prioritizing advanced features
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  <strong>Budget-Conscious Parents</strong> show 2.3x higher retention when using savings goals feature
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  New emerging segment detected: <strong>"Remote Workers"</strong> - 8% of user base, unique needs
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Distribution Overview */}
      <Card className="p-6">
        <h3 className="mb-4">Customer Segment Distribution</h3>
        <div className="space-y-4">
          {mockPersonas.map((persona, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{persona.avatar}</span>
                  <span>{persona.name}</span>
                </div>
                <span>{persona.percentage}%</span>
              </div>
              <Progress value={persona.percentage} />
            </div>
          ))}
        </div>
      </Card>

      {/* Persona Cards */}
      <div className="space-y-6">
        {personas.map((persona, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{persona.avatar}</div>
                <div>
                  <h2 className="mb-2">{persona.name}</h2>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{persona.percentage}% of user base</Badge>
                    <Badge variant="secondary">{persona.age}</Badge>
                    <Badge variant="secondary">{persona.income}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <Users className="w-4 h-4" />
                  <span>Demographics</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Occupation:</span>
                    <span>{persona.occupation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span>{persona.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Income Range:</span>
                    <span>{persona.income}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <Target className="w-4 h-4" />
                  <span>Preferences</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Channel:</span>
                    <span>{persona.preferences.channel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Communication:</span>
                    <span>{persona.preferences.communication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Support Time:</span>
                    <span>{persona.preferences.supportTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="mb-3 text-green-600">Goals</h4>
                <ul className="space-y-2">
                  {persona.goals.map((goal, gIndex) => (
                    <li key={gIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-red-600">Pain Points</h4>
                <ul className="space-y-2">
                  {persona.painPoints.map((pain, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0" />
                      <span>{pain}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-blue-600">Behaviors</h4>
                <ul className="space-y-2">
                  {persona.behaviors.map((behavior, bIndex) => (
                    <li key={bIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="text-slate-600">Feature Priorities for this Persona:</div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  View AI Recommendations
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-slate-600 mb-2">Total Personas</div>
          <div className="text-3xl mb-2">{personas.length}</div>
          <div className="text-slate-500">Active segments</div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Data Sources</div>
          <div className="text-3xl mb-2">7</div>
          <div className="text-slate-500">Connected sources</div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Last Updated</div>
          <div className="text-3xl mb-2">2d</div>
          <div className="text-slate-500">Auto-refresh weekly</div>
        </Card>

        <Card className="p-6">
          <div className="text-slate-600 mb-2">Coverage</div>
          <div className="text-3xl mb-2">100%</div>
          <div className="text-slate-500">Of user base</div>
        </Card>
      </div>
    </div>
  );
}
