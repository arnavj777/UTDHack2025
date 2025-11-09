import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { aiInsightService } from '../services/analyticsService';
import { ApiError } from '../services/api';

export function AIInsightEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    insight_type: 'analysis',
    narrative: '',
    confidence_score: 0,
  });

  useEffect(() => {
    const loadAIInsight = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const aiInsight = await aiInsightService.get(parseInt(id));
        setFormData({
          title: aiInsight.title || '',
          description: aiInsight.description || '',
          insight_type: aiInsight.insight_type || 'analysis',
          narrative: aiInsight.narrative || '',
          confidence_score: aiInsight.confidence_score || 0,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load AI insight. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadAIInsight();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await aiInsightService.update(parseInt(id), formData);
      navigate('/workspace/ai-insights');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update AI insight. Please try again.');
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
        <h1 className="mb-2">Edit AI Insight</h1>
        <p className="text-slate-600">Update AI-generated insight</p>
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
              <Label htmlFor="insight_type">Insight Type</Label>
              <Select value={formData.insight_type} onValueChange={(value) => setFormData({ ...formData, insight_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="prediction">Prediction</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                  <SelectItem value="trend">Trend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidence_score">Confidence Score (0-100)</Label>
              <Input
                id="confidence_score"
                type="number"
                min="0"
                max="100"
                value={formData.confidence_score}
                onChange={(e) => setFormData({ ...formData, confidence_score: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="narrative">Narrative</Label>
            <Textarea
              id="narrative"
              value={formData.narrative}
              onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
              className="min-h-48"
              placeholder="Enter insight narrative..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Updating...' : 'Update AI Insight'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/ai-insights')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

