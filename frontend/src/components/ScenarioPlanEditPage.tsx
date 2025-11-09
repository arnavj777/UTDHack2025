import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { scenarioPlanService } from '../services/strategyService';
import { ApiError } from '../services/api';

export function ScenarioPlanEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scenario_type: 'what-if',
  });

  useEffect(() => {
    const loadScenarioPlan = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const scenarioPlan = await scenarioPlanService.get(parseInt(id));
        setFormData({
          title: scenarioPlan.title || '',
          description: scenarioPlan.description || '',
          scenario_type: scenarioPlan.scenario_type || 'what-if',
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load scenario plan. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadScenarioPlan();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await scenarioPlanService.update(parseInt(id), formData);
      navigate('/workspace/scenario-planning');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update scenario plan. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Card className="p-6">
          <p className="text-slate-600">Loading...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Edit Scenario Plan</h1>
        <p className="text-slate-600">Update scenario planning analysis</p>
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
              {loading ? 'Updating...' : 'Update Scenario Plan'}
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

