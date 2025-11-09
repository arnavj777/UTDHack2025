import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Plus, Save, Download, MessageSquare, Clock, CheckCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { Separator } from './ui/separator';

interface PRD {
  id?: number;
  feature_name: string;
  owner: string;
  status: string;
  target_release: string;
  problem_statement: string;
  customer_pain_points: string[];
  supporting_data: string[];
  goals: Array<{ goal: string; keyResults: string }>;
  key_results: string;
  functional_requirements: Array<{ id: string; title: string; priority: string; status: string }>;
  metrics: Array<{ metric: string; target: string; current: string; measurement: string }>;
}

const API_BASE_URL = '/api/prds';

export function PRDBuilder() {
  const [prds, setPrds] = useState<PRD[]>([]);
  const [currentPrdId, setCurrentPrdId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // PRD form state
  const [featureName, setFeatureName] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('draft');
  const [targetRelease, setTargetRelease] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [customerPainPoints, setCustomerPainPoints] = useState<string[]>(['']);
  const [supportingData, setSupportingData] = useState<string[]>(['']);
  const [goals, setGoals] = useState<Array<{ goal: string; keyResults: string }>>([{ goal: '', keyResults: '' }]);
  const [keyResults, setKeyResults] = useState('');
  const [functionalRequirements, setFunctionalRequirements] = useState<Array<{ id: string; title: string; priority: string; status: string }>>([
    { id: 'REQ-1', title: '', priority: 'High', status: 'Draft' }
  ]);
  const [metrics, setMetrics] = useState<Array<{ metric: string; target: string; current: string; measurement: string }>>([
    { metric: '', target: '', current: '', measurement: '' }
  ]);

  // Load all PRDs on mount
  useEffect(() => {
    loadPRDs();
  }, []);

  // Load PRD data when currentPrdId changes
  useEffect(() => {
    if (currentPrdId) {
      loadPRD(currentPrdId);
    }
    // Don't reset form when currentPrdId becomes null - let user continue editing
  }, [currentPrdId]);

  const loadPRDs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL + '/');
      if (!response.ok) throw new Error('Failed to load PRDs');
      const data = await response.json();
      setPrds(data);
      // Don't auto-select first PRD - let user choose or create new
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PRDs');
    } finally {
      setLoading(false);
    }
  };

  const loadPRD = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}/`);
      if (!response.ok) throw new Error('Failed to load PRD');
      const data = await response.json();
      populateForm(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PRD');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (prd: PRD) => {
    setFeatureName(prd.feature_name || '');
    setOwner(prd.owner || '');
    setStatus(prd.status || 'draft');
    // Format date for HTML date input (YYYY-MM-DD)
    if (prd.target_release) {
      const date = new Date(prd.target_release);
      setTargetRelease(date.toISOString().split('T')[0]);
    } else {
      setTargetRelease('');
    }
    setProblemStatement(prd.problem_statement || '');
    setCustomerPainPoints(prd.customer_pain_points && prd.customer_pain_points.length > 0 ? prd.customer_pain_points : ['']);
    setSupportingData(prd.supporting_data && prd.supporting_data.length > 0 ? prd.supporting_data : ['']);
    setGoals(prd.goals && prd.goals.length > 0 ? prd.goals : [{ goal: '', keyResults: '' }]);
    setKeyResults(prd.key_results || '');
    setFunctionalRequirements(prd.functional_requirements && prd.functional_requirements.length > 0 ? prd.functional_requirements : [{ id: 'REQ-1', title: '', priority: 'High', status: 'Draft' }]);
    setMetrics(prd.metrics && prd.metrics.length > 0 ? prd.metrics : [{ metric: '', target: '', current: '', measurement: '' }]);
  };

  const resetForm = () => {
    setFeatureName('');
    setOwner('');
    setStatus('draft');
    setTargetRelease('');
    setProblemStatement('');
    setCustomerPainPoints(['']);
    setSupportingData(['']);
    setGoals([{ goal: '', keyResults: '' }]);
    setKeyResults('');
    setFunctionalRequirements([{ id: 'REQ-1', title: '', priority: 'High', status: 'Draft' }]);
    setMetrics([{ metric: '', target: '', current: '', measurement: '' }]);
  };

  const savePRD = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const prdData: any = {
        feature_name: featureName,
        owner: owner,
        status: status,
        target_release: targetRelease || null,
        problem_statement: problemStatement,
        customer_pain_points: customerPainPoints.filter(p => p.trim() !== ''),
        supporting_data: supportingData.filter(s => s.trim() !== ''),
        goals: goals.filter(g => g.goal.trim() !== ''),
        key_results: keyResults,
        functional_requirements: functionalRequirements.filter(r => r.title.trim() !== ''),
        metrics: metrics.filter(m => m.metric.trim() !== ''),
      };
      
      // Remove null target_release if empty
      if (!targetRelease) {
        prdData.target_release = null;
      }

      const url = currentPrdId ? `${API_BASE_URL}/${currentPrdId}/` : API_BASE_URL + '/';
      const method = currentPrdId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prdData),
      });

      if (!response.ok) throw new Error('Failed to save PRD');
      
      const savedPrd = await response.json();
      setSuccess('PRD saved successfully!');
      
      if (!currentPrdId) {
        setCurrentPrdId(savedPrd.id);
      }
      
      await loadPRDs();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save PRD');
    } finally {
      setSaving(false);
    }
  };

  const createNewPRD = () => {
    setCurrentPrdId(null);
    resetForm();
    setSuccess(null);
    setError(null);
  };

  const deletePRD = async (id: number) => {
    if (!confirm('Are you sure you want to delete this PRD?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete PRD');
      await loadPRDs();
      if (currentPrdId === id) {
        setCurrentPrdId(null);
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete PRD');
    }
  };

  // Pain Points handlers
  const addPainPoint = () => {
    setCustomerPainPoints([...customerPainPoints, '']);
  };

  const removePainPoint = (index: number) => {
    if (customerPainPoints.length > 1) {
      setCustomerPainPoints(customerPainPoints.filter((_, i) => i !== index));
    }
  };

  const updatePainPoint = (index: number, value: string) => {
    const updated = [...customerPainPoints];
    updated[index] = value;
    setCustomerPainPoints(updated);
  };

  // Supporting Data handlers
  const addSupportingData = () => {
    setSupportingData([...supportingData, '']);
  };

  const removeSupportingData = (index: number) => {
    if (supportingData.length > 1) {
      setSupportingData(supportingData.filter((_, i) => i !== index));
    }
  };

  const updateSupportingData = (index: number, value: string) => {
    const updated = [...supportingData];
    updated[index] = value;
    setSupportingData(updated);
  };

  // Goals handlers
  const addGoal = () => {
    setGoals([...goals, { goal: '', keyResults: '' }]);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, field: 'goal' | 'keyResults', value: string) => {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    setGoals(updated);
  };

  // Requirements handlers
  const addRequirement = () => {
    const newId = `REQ-${functionalRequirements.length + 1}`;
    setFunctionalRequirements([...functionalRequirements, { id: newId, title: '', priority: 'High', status: 'Draft' }]);
  };

  const removeRequirement = (index: number) => {
    if (functionalRequirements.length > 1) {
      setFunctionalRequirements(functionalRequirements.filter((_, i) => i !== index));
    }
  };

  const updateRequirement = (index: number, field: string, value: string) => {
    const updated = [...functionalRequirements];
    updated[index] = { ...updated[index], [field]: value };
    setFunctionalRequirements(updated);
  };

  // Metrics handlers
  const addMetric = () => {
    setMetrics([...metrics, { metric: '', target: '', current: '', measurement: '' }]);
  };

  const removeMetric = (index: number) => {
    if (metrics.length > 1) {
      setMetrics(metrics.filter((_, i) => i !== index));
    }
  };

  const updateMetric = (index: number, field: string, value: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
  };

  const currentPRD = prds.find(p => p.id === currentPrdId);

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
          <Button className="gap-2" onClick={savePRD} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      </div>

      {/* PRD Selection */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-slate-600 mb-2 block">Select PRD</label>
            <Select value={currentPrdId?.toString() || 'new'} onValueChange={(value) => {
              if (value === 'new') {
                createNewPRD();
              } else {
                setCurrentPrdId(parseInt(value));
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a PRD or create new" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create New PRD
                  </span>
                </SelectItem>
                {prds.map((prd) => (
                  <SelectItem key={prd.id} value={prd.id?.toString() || ''}>
                    {prd.feature_name || `PRD #${prd.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={createNewPRD} className="mt-6">
            <Plus className="w-4 h-4 mr-2" />
            New PRD
          </Button>
          {currentPrdId && (
            <Button variant="outline" onClick={() => deletePRD(currentPrdId)} className="mt-6 text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </Card>

      {/* Success/Error Messages */}
      {success && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </Card>
      )}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {loading && !currentPrdId && prds.length === 0 && (
        <Card className="p-6">
          <div className="text-center text-slate-600">Loading PRDs...</div>
        </Card>
      )}

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
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  className="text-xl"
                  disabled={false}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-600">Owner</label>
                  <Input
                    placeholder="Owner name"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-600">Status</label>
                  <Select value={status} onValueChange={setStatus}>
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
                  <Input 
                    type="date" 
                    value={targetRelease}
                    onChange={(e) => setTargetRelease(e.target.value)}
                  />
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
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                />

                <Separator className="my-4" />

                <div className="flex items-center justify-between mb-3">
                  <h4>Customer Pain Points</h4>
                  <Button variant="outline" size="sm" onClick={addPainPoint} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 mb-4">
                  {customerPainPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0" />
                      <Input
                        value={point}
                        onChange={(e) => updatePainPoint(index, e.target.value)}
                        placeholder="Enter pain point"
                        className="flex-1"
                      />
                      {customerPainPoints.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePainPoint(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h4>Supporting Data</h4>
                  <Button variant="outline" size="sm" onClick={addSupportingData} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {supportingData.map((data, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-slate-600">•</span>
                      <Input
                        value={data}
                        onChange={(e) => updateSupportingData(index, e.target.value)}
                        placeholder="Enter supporting data point"
                        className="flex-1"
                      />
                      {supportingData.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSupportingData(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
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

                <div className="flex items-center justify-between mb-3">
                  <h4>Primary Goals</h4>
                  <Button variant="outline" size="sm" onClick={addGoal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Goal
                  </Button>
                </div>
                <div className="space-y-3 mb-6">
                  {goals.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            value={item.goal}
                            onChange={(e) => updateGoal(index, 'goal', e.target.value)}
                            placeholder="Enter goal"
                            className="flex-1"
                          />
                          {goals.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGoal(index)}
                              className="text-red-600 hover:text-red-700 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <Input
                          value={item.keyResults}
                          onChange={(e) => updateGoal(index, 'keyResults', e.target.value)}
                          placeholder="Enter key results/metric"
                          className="text-slate-500"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                <h4 className="mb-3">Key Results</h4>
                <Textarea 
                  className="min-h-24"
                  placeholder="Enter key results"
                  value={keyResults}
                  onChange={(e) => setKeyResults(e.target.value)}
                />
              </Card>
            </TabsContent>

            <TabsContent value="requirements">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Functional Requirements</h3>
                  <Button variant="outline" size="sm" className="gap-2" onClick={addRequirement}>
                    <Plus className="w-4 h-4" />
                    Add Requirement
                  </Button>
                </div>

                <div className="space-y-3">
                  {functionalRequirements.map((req, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-600 shrink-0">{req.id}</span>
                          <Input
                            value={req.title}
                            onChange={(e) => updateRequirement(index, 'title', e.target.value)}
                            placeholder="Enter requirement title"
                            className="flex-1"
                          />
                          {functionalRequirements.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRequirement(index)}
                              className="text-red-600 hover:text-red-700 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={req.priority}
                            onValueChange={(value) => updateRequirement(index, 'priority', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={req.status}
                            onValueChange={(value) => updateRequirement(index, 'status', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="In Review">In Review</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                            </SelectContent>
                          </Select>
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
                <div className="flex items-center justify-between mb-4">
                  <h3>Success Metrics</h3>
                  <Button variant="outline" size="sm" onClick={addMetric} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Metric
                  </Button>
                </div>

                <div className="space-y-4">
                  {metrics.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.metric}
                            onChange={(e) => updateMetric(index, 'metric', e.target.value)}
                            placeholder="Metric name"
                            className="flex-1"
                          />
                          {metrics.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMetric(index)}
                              className="text-red-600 hover:text-red-700 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-slate-600 mb-1 text-sm">Target</div>
                            <Input
                              value={item.target}
                              onChange={(e) => updateMetric(index, 'target', e.target.value)}
                              placeholder="Target value"
                            />
                          </div>
                          <div>
                            <div className="text-slate-600 mb-1 text-sm">Current</div>
                            <Input
                              value={item.current}
                              onChange={(e) => updateMetric(index, 'current', e.target.value)}
                              placeholder="Current value"
                            />
                          </div>
                          <div>
                            <div className="text-slate-600 mb-1 text-sm">Measurement</div>
                            <Input
                              value={item.measurement}
                              onChange={(e) => updateMetric(index, 'measurement', e.target.value)}
                              placeholder="e.g., Weekly"
                            />
                          </div>
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
              {currentPRD && (
                <>
                  <div>Last Updated: {new Date(currentPRD.updated_at || '').toLocaleDateString()}</div>
                  <div>Created: {new Date(currentPRD.created_at || '').toLocaleDateString()}</div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
