import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { marketSizingService } from '../services/strategyService';
import { ApiError } from '../services/api';

export function MarketSizingEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tam: 0,
    sam: 0,
    som: 0,
  });

  useEffect(() => {
    const loadMarketSizing = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const marketSizing = await marketSizingService.get(parseInt(id));
        setFormData({
          title: marketSizing.title || '',
          description: marketSizing.description || '',
          tam: marketSizing.tam || 0,
          sam: marketSizing.sam || 0,
          som: marketSizing.som || 0,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load market sizing. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadMarketSizing();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await marketSizingService.update(parseInt(id), formData);
      navigate('/workspace/market-sizing');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update market sizing. Please try again.');
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
        <h1 className="mb-2">Edit Market Sizing</h1>
        <p className="text-slate-600">Update market sizing analysis</p>
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
              {loading ? 'Updating...' : 'Update Market Sizing'}
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

