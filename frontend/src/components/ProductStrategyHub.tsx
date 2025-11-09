import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Target, Sparkles, Plus, TrendingUp, Users, DollarSign, Edit, Check } from 'lucide-react';
import { useState } from 'react';

export function ProductStrategyHub() {
  const [editing, setEditing] = useState(false);

  const okrs = [
    {
      objective: 'Become the #1 mobile banking app for millennials',
      progress: 68,
      keyResults: [
        { description: 'Reach 500K active users', current: 340, target: 500, unit: 'K users' },
        { description: 'Achieve 4.5+ app store rating', current: 4.2, target: 4.5, unit: 'stars' },
        { description: 'Reduce customer churn to <5%', current: 7, target: 5, unit: '%' }
      ]
    },
    {
      objective: 'Launch AI-powered financial insights',
      progress: 45,
      keyResults: [
        { description: 'Ship insights feature to 100% users', current: 45, target: 100, unit: '%' },
        { description: 'Achieve 40% weekly engagement', current: 12, target: 40, unit: '%' },
        { description: 'Collect 1000+ feedback responses', current: 234, target: 1000, unit: 'responses' }
      ]
    }
  ];

  const competitors = [
    { name: 'Chime', strength: 'Early direct deposit', weakness: 'Limited features', threat: 'Medium' },
    { name: 'Cash App', strength: 'Social payments', weakness: 'Security concerns', threat: 'High' },
    { name: 'Venmo', strength: 'Network effects', weakness: 'Business model', threat: 'Medium' },
    { name: 'Traditional Banks', strength: 'Trust & capital', weakness: 'Poor UX', threat: 'Low' }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Product Strategy Hub</h1>
          <p className="text-slate-600">Define and track your product vision and goals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Strategy Coach
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add OKR
          </Button>
        </div>
      </div>

      {/* Vision Statement */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3>Vision Statement</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setEditing(!editing)}
            className="gap-2"
          >
            {editing ? (
              <>
                <Check className="w-4 h-4" /> Save
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" /> Edit
              </>
            )}
          </Button>
        </div>
        
        {editing ? (
          <Textarea 
            className="min-h-32"
            defaultValue="To empower young professionals to take control of their financial future through intelligent, mobile-first banking that combines cutting-edge technology with personalized insights and exceptional user experience."
          />
        ) : (
          <p className="text-slate-700 leading-relaxed">
            To empower young professionals to take control of their financial future through intelligent, 
            mobile-first banking that combines cutting-edge technology with personalized insights and 
            exceptional user experience.
          </p>
        )}

        <div className="mt-4 pt-4 border-t">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Users className="w-4 h-4" />
                <span>Target Market</span>
              </div>
              <p>Millennials & Gen Z (25-40)</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Revenue Model</span>
              </div>
              <p>Subscription + Transaction Fees</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Growth Strategy</span>
              </div>
              <p>Product-Led Growth</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">AI Strategy Recommendations</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Consider pivoting messaging to emphasize "financial wellness" - trending topic with 230% growth in searches
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Competitor Chime just launched savings pods feature - 87% positive sentiment. Evaluate for roadmap.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-slate-700">
                  Your NPS correlation analysis shows personalization features drive 2.3x higher retention
                </span>
              </li>
            </ul>
            <Button variant="outline" size="sm">View Full Analysis</Button>
          </div>
        </div>
      </Card>

      {/* OKRs */}
      <div>
        <h3 className="mb-4">Objectives & Key Results (OKRs)</h3>
        <div className="space-y-4">
          {okrs.map((okr, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="mb-2">{okr.objective}</h4>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>Overall Progress:</span>
                    <span>{okr.progress}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Details</Button>
                </div>
              </div>

              <Progress value={okr.progress} className="mb-4" />

              <div className="space-y-3">
                {okr.keyResults.map((kr, krIndex) => (
                  <div key={krIndex} className="pl-4 border-l-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700">{kr.description}</span>
                      <span className="text-slate-600">
                        {kr.current} / {kr.target} {kr.unit}
                      </span>
                    </div>
                    <Progress value={(kr.current / kr.target) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Competitive Landscape */}
      <Card className="p-6">
        <h3 className="mb-4">Competitive Landscape</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3">Competitor</th>
                <th className="text-left p-3">Key Strength</th>
                <th className="text-left p-3">Weakness</th>
                <th className="text-left p-3">Threat Level</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="p-3">{competitor.name}</td>
                  <td className="p-3 text-slate-600">{competitor.strength}</td>
                  <td className="p-3 text-slate-600">{competitor.weakness}</td>
                  <td className="p-3">
                    <Badge 
                      variant={
                        competitor.threat === 'High' ? 'destructive' : 
                        competitor.threat === 'Medium' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {competitor.threat}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Competitive Analysis
          </Button>
        </div>
      </Card>
    </div>
  );
}
