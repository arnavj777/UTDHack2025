import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { gtmStrategyService } from '../services/gtmService';
import { ApiError } from '../services/api';

export function GTMStrategyEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    launch_date: '',
  });

  useEffect(() => {
    const loadGTMStrategy = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const gtmStrategy = await gtmStrategyService.get(parseInt(id));
        setFormData({
          title: gtmStrategy.title || '',
          description: gtmStrategy.description || '',
          status: gtmStrategy.status || 'draft',
          launch_date: gtmStrategy.launch_date ? gtmStrategy.launch_date.split('T')[0] : '',
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load GTM strategy. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadGTMStrategy();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await gtmStrategyService.update(parseInt(id), formData);
      navigate('/workspace/gtm-strategy');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update GTM strategy. Please try again.');
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
        <h1 className="mb-2">Edit GTM Strategy</h1>
        <p className="text-slate-600">Update Go-to-Market strategy</p>
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="executing">Executing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="launch_date">Launch Date</Label>
              <Input
                id="launch_date"
                type="date"
                value={formData.launch_date}
                onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
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
              {loading ? 'Updating...' : 'Update GTM Strategy'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/gtm-strategy')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

