import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { competitorIntelService } from '../services/researchService';
import { ApiError } from '../services/api';

export function CompetitorIntelEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    competitor_name: '',
    intel_type: 'feature',
    date: '',
  });

  useEffect(() => {
    const loadCompetitorIntel = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const intel = await competitorIntelService.get(parseInt(id));
        setFormData({
          title: intel.title || '',
          description: intel.description || '',
          competitor_name: intel.competitor_name || '',
          intel_type: intel.intel_type || 'feature',
          date: intel.date ? intel.date.split('T')[0] : '',
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load competitor intelligence. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadCompetitorIntel();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await competitorIntelService.update(parseInt(id), formData);
      navigate('/workspace/competitors');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update competitor intelligence. Please try again.');
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
        <h1 className="mb-2">Edit Competitor Intelligence</h1>
        <p className="text-slate-600">Update competitor intelligence entry</p>
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

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competitor_name">Competitor Name</Label>
              <Input
                id="competitor_name"
                value={formData.competitor_name}
                onChange={(e) => setFormData({ ...formData, competitor_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intel_type">Intel Type</Label>
              <Select value={formData.intel_type} onValueChange={(value) => setFormData({ ...formData, intel_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              {loading ? 'Updating...' : 'Update Competitor Intelligence'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/competitors')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

