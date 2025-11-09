import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ideaService } from '../services/strategyService';
import { ApiError } from '../services/api';

export function IdeaEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'new',
    tags: [] as string[],
    impact_score: 0,
    effort_score: 0,
  });

  useEffect(() => {
    const loadIdea = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const idea = await ideaService.get(parseInt(id));
        setFormData({
          title: idea.title || '',
          description: idea.description || '',
          status: idea.status || 'new',
          tags: idea.tags || [],
          impact_score: idea.impact_score || 0,
          effort_score: idea.effort_score || 0,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load idea. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadIdea();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await ideaService.update(parseInt(id), formData);
      navigate('/workspace/ideas');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update idea. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Edit Idea</h1>
        <p className="text-slate-600">Update idea details</p>
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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact_score">Impact Score (0-10)</Label>
              <Input
                id="impact_score"
                type="number"
                min="0"
                max="10"
                value={formData.impact_score}
                onChange={(e) => setFormData({ ...formData, impact_score: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effort_score">Effort Score (0-10)</Label>
              <Input
                id="effort_score"
                type="number"
                min="0"
                max="10"
                value={formData.effort_score}
                onChange={(e) => setFormData({ ...formData, effort_score: parseInt(e.target.value) || 0 })}
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
              {loading ? 'Updating...' : 'Update Idea'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/ideas')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

