import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { aiAgentService } from '../services/automationService';
import { ApiError } from '../services/api';

export function AIAgentEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agent_type: 'automation',
    status: 'active',
    autonomy_level: 50,
  });

  useEffect(() => {
    const loadAIAgent = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const aiAgent = await aiAgentService.get(parseInt(id));
        setFormData({
          title: aiAgent.title || '',
          description: aiAgent.description || '',
          agent_type: aiAgent.agent_type || 'automation',
          status: aiAgent.status || 'active',
          autonomy_level: aiAgent.autonomy_level || 50,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load AI agent. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadAIAgent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await aiAgentService.update(parseInt(id), formData);
      navigate('/workspace/ai-agent');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update AI agent. Please try again.');
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
        <h1 className="mb-2">Edit AI Agent</h1>
        <p className="text-slate-600">Update AI agent configuration</p>
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent_type">Agent Type</Label>
              <Select value={formData.agent_type} onValueChange={(value) => setFormData({ ...formData, agent_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="autonomy_level">Autonomy Level (0-100)</Label>
              <Input
                id="autonomy_level"
                type="number"
                min="0"
                max="100"
                value={formData.autonomy_level}
                onChange={(e) => setFormData({ ...formData, autonomy_level: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Updating...' : 'Update AI Agent'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/ai-agent')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

