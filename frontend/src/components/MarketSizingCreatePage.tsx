import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { marketSizingService } from '../services/strategyService';
import { ApiError } from '../services/api';

export function MarketSizingCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tam: 0,
    sam: 0,
    som: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await marketSizingService.create(formData);
      navigate('/workspace/market-sizing');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create market sizing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Create Market Sizing</h1>
        <p className="text-slate-600">Add a new market sizing analysis</p>
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
              <Label htmlFor="tam">TAM (Total Addressable Market)</Label>
              <Input
                id="tam"
                type="number"
                step="0.01"
                value={formData.tam}
                onChange={(e) => setFormData({ ...formData, tam: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sam">SAM (Serviceable Addressable Market)</Label>
              <Input
                id="sam"
                type="number"
                step="0.01"
                value={formData.sam}
                onChange={(e) => setFormData({ ...formData, sam: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="som">SOM (Serviceable Obtainable Market)</Label>
              <Input
                id="som"
                type="number"
                step="0.01"
                value={formData.som}
                onChange={(e) => setFormData({ ...formData, som: parseFloat(e.target.value) || 0 })}
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
              {loading ? 'Creating...' : 'Create Market Sizing'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/market-sizing')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

