import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Target, Sparkles, Plus, TrendingUp, Users, DollarSign, Edit, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { productStrategyService } from '../services/strategyService';
import { ProductStrategy } from '../types/ProductStrategy';
import { ApiError } from '../services/api';

interface OKR {
  id: string;
  objective: string;
  progress: number;
  keyResults: Array<{
    description: string;
    current: number;
    target: number;
    unit: string;
  }>;
}

export function ProductStrategyHub() {
  const [strategy, setStrategy] = useState<ProductStrategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [visionStatement, setVisionStatement] = useState('');
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [showAddOKR, setShowAddOKR] = useState(false);
  const [newOKR, setNewOKR] = useState({
    objective: '',
    keyResults: [{ description: '', current: 0, target: 0, unit: '' }]
  });

  useEffect(() => {
    loadStrategy();
  }, []);

  const loadStrategy = async () => {
    try {
      setLoading(true);
      const strategies = await productStrategyService.list();
      if (strategies.length > 0) {
        const s = strategies[0];
        setStrategy(s);
        setVisionStatement(s.data?.visionStatement || 'To empower young professionals to take control of their financial future through intelligent, mobile-first banking that combines cutting-edge technology with personalized insights and exceptional user experience.');
        setOkrs(s.data?.okrs || []);
      } else {
        // Create default strategy if none exists
        const newStrategy = await productStrategyService.create({
          title: 'Product Strategy',
          description: 'Main product strategy',
          data: {
            visionStatement: 'To empower young professionals to take control of their financial future through intelligent, mobile-first banking that combines cutting-edge technology with personalized insights and exceptional user experience.',
            okrs: []
          }
        });
        setStrategy(newStrategy);
        setVisionStatement(newStrategy.data?.visionStatement || '');
        setOkrs(newStrategy.data?.okrs || []);
      }
    } catch (error) {
      console.error('Failed to load strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOKRProgress = (okr: OKR): number => {
    if (!okr.keyResults || okr.keyResults.length === 0) return 0;
    const totalProgress = okr.keyResults.reduce((sum, kr) => {
      if (kr.target === 0) return sum;
      const progress = Math.min(100, (kr.current / kr.target) * 100);
      return sum + progress;
    }, 0);
    return Math.round(totalProgress / okr.keyResults.length);
  };

  const saveVisionStatement = async () => {
    if (!strategy) return;
    try {
      setSaving(true);
      const updated = await productStrategyService.update(strategy.id, {
        data: {
          ...strategy.data,
          visionStatement: visionStatement
        }
      });
      setStrategy(updated);
      setEditing(false);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to save vision statement');
      }
    } finally {
      setSaving(false);
    }
  };

  const addOKR = async () => {
    if (!newOKR.objective.trim()) {
      alert('Please enter an objective');
      return;
    }
    
    try {
      setSaving(true);
      
      // Ensure we have a strategy
      let currentStrategy = strategy;
      if (!currentStrategy) {
        // Create a new strategy if none exists
        currentStrategy = await productStrategyService.create({
          title: 'Product Strategy',
          description: 'Main product strategy',
          data: {
            visionStatement: visionStatement || 'To empower young professionals to take control of their financial future through intelligent, mobile-first banking that combines cutting-edge technology with personalized insights and exceptional user experience.',
            okrs: []
          }
        });
        setStrategy(currentStrategy);
      }
      
      const filteredKeyResults = newOKR.keyResults.filter(kr => kr.description.trim() !== '');
      const okr: OKR = {
        id: Date.now().toString(),
        objective: newOKR.objective,
        progress: 0,
        keyResults: filteredKeyResults
      };
      // Calculate initial progress
      okr.progress = calculateOKRProgress(okr);
      const updatedOkrs = [...okrs, okr];
      const updated = await productStrategyService.update(currentStrategy.id, {
        data: {
          ...currentStrategy.data,
          okrs: updatedOkrs
        }
      });
      setStrategy(updated);
      setOkrs(updatedOkrs);
      setNewOKR({ objective: '', keyResults: [{ description: '', current: 0, target: 0, unit: '' }] });
      setShowAddOKR(false);
    } catch (error) {
      console.error('Error adding OKR:', error);
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to add OKR. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteOKR = async (okrId: string) => {
    if (!strategy || !confirm('Are you sure you want to delete this OKR?')) return;
    try {
      setSaving(true);
      const updatedOkrs = okrs.filter(okr => okr.id !== okrId);
      const updated = await productStrategyService.update(strategy.id, {
        data: {
          ...strategy.data,
          okrs: updatedOkrs
        }
      });
      setStrategy(updated);
      setOkrs(updatedOkrs);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to delete OKR');
      }
    } finally {
      setSaving(false);
    }
  };

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
        <div className="flex gap-2 relative z-10">
          <Button variant="outline" className="gap-2" type="button">
            <Sparkles className="w-4 h-4" />
            AI Strategy Coach
          </Button>
          <Button 
            className="gap-2" 
            type="button"
            onClick={() => {
              console.log('Add OKR button clicked, showAddOKR:', showAddOKR);
              setShowAddOKR(true);
            }}
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
          >
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
            onClick={() => {
              if (editing) {
                saveVisionStatement();
              } else {
                setEditing(true);
              }
            }}
            className="gap-2"
            disabled={saving}
          >
            {editing ? (
              <>
                <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
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
            value={visionStatement}
            onChange={(e) => setVisionStatement(e.target.value)}
            placeholder="Enter your vision statement..."
          />
        ) : (
          <p className="text-slate-700 leading-relaxed">
            {visionStatement || 'No vision statement set. Click Edit to add one.'}
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
        {loading ? (
          <Card className="p-6">
            <p className="text-slate-600">Loading OKRs...</p>
          </Card>
        ) : okrs.length === 0 ? (
          <Card className="p-6">
            <p className="text-slate-600">No OKRs yet. Click "Add OKR" to create your first one.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {okrs.map((okr) => (
              <Card key={okr.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="mb-2">{okr.objective}</h4>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Overall Progress:</span>
                      <span>{calculateOKRProgress(okr)}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => deleteOKR(okr.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Progress value={calculateOKRProgress(okr)} className="mb-4" />

                {okr.keyResults && okr.keyResults.length > 0 && (
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
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add OKR Dialog */}
      <Dialog open={showAddOKR} onOpenChange={setShowAddOKR}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Add New OKR</DialogTitle>
            <DialogDescription>
              Create a new Objective and Key Results
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="objective">Objective *</Label>
              <Input
                id="objective"
                value={newOKR.objective}
                onChange={(e) => setNewOKR({ ...newOKR, objective: e.target.value })}
                placeholder="e.g., Become the #1 mobile banking app for millennials"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Key Results</Label>
              {newOKR.keyResults.map((kr, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Key Result {index + 1}</Label>
                    {newOKR.keyResults.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNewOKR({
                            ...newOKR,
                            keyResults: newOKR.keyResults.filter((_, i) => i !== index)
                          });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Description"
                    value={kr.description}
                    onChange={(e) => {
                      const updated = [...newOKR.keyResults];
                      updated[index].description = e.target.value;
                      setNewOKR({ ...newOKR, keyResults: updated });
                    }}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Current"
                      value={kr.current || ''}
                      onChange={(e) => {
                        const updated = [...newOKR.keyResults];
                        updated[index].current = parseFloat(e.target.value) || 0;
                        setNewOKR({ ...newOKR, keyResults: updated });
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Target"
                      value={kr.target || ''}
                      onChange={(e) => {
                        const updated = [...newOKR.keyResults];
                        updated[index].target = parseFloat(e.target.value) || 0;
                        setNewOKR({ ...newOKR, keyResults: updated });
                      }}
                    />
                    <Input
                      placeholder="Unit (e.g., K users)"
                      value={kr.unit}
                      onChange={(e) => {
                        const updated = [...newOKR.keyResults];
                        updated[index].unit = e.target.value;
                        setNewOKR({ ...newOKR, keyResults: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewOKR({
                    ...newOKR,
                    keyResults: [...newOKR.keyResults, { description: '', current: 0, target: 0, unit: '' }]
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Key Result
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddOKR(false)}>
              Cancel
            </Button>
            <Button onClick={addOKR} disabled={saving || !newOKR.objective.trim()}>
              {saving ? 'Adding...' : 'Add OKR'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
