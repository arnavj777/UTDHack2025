import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { competitorIntelService } from '../services/researchService';
import { ApiError } from '../services/api';

export function CompetitorIntelCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    competitor_name: '',
    intel_type: 'feature',
    date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await competitorIntelService.create(formData);
      navigate('/workspace/competitors');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create competitor intelligence. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Create Competitor Intelligence</h1>
        <p className="text-slate-600">Add a new competitor intelligence entry</p>
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
              {loading ? 'Creating...' : 'Create Competitor Intelligence'}
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

