import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { scenarioPlanService } from '../services/strategyService';
import { ApiError } from '../services/api';

export function ScenarioPlanCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scenario_type: 'what-if',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await scenarioPlanService.create(formData);
      navigate('/workspace/scenario-planning');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create scenario plan. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Create Scenario Plan</h1>
        <p className="text-slate-600">Add a new scenario planning analysis</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scenario_type">Scenario Type</Label>
            <Select value={formData.scenario_type} onValueChange={(value) => setFormData({ ...formData, scenario_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="what-if">What-If</SelectItem>
                <SelectItem value="best-case">Best Case</SelectItem>
                <SelectItem value="worst-case">Worst Case</SelectItem>
                <SelectItem value="most-likely">Most Likely</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Creating...' : 'Create Scenario Plan'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/scenario-planning')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

