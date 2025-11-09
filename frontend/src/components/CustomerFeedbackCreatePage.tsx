import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { customerFeedbackService } from '../services/researchService';
import { ApiError } from '../services/api';

export function CustomerFeedbackCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: 'support',
    sentiment: 'neutral',
    rating: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await customerFeedbackService.create(formData);
      navigate('/workspace/feedback');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create customer feedback. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Create Customer Feedback</h1>
        <p className="text-slate-600">Add a new customer feedback entry</p>
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
              <Label htmlFor="source">Source</Label>
              <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="nps">NPS Survey</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sentiment">Sentiment</Label>
              <Select value={formData.sentiment} onValueChange={(value) => setFormData({ ...formData, sentiment: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 0 })}
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
              {loading ? 'Creating...' : 'Create Customer Feedback'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/feedback')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

