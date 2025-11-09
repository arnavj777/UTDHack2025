import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { contentAssetService } from '../services/gtmService';
import { ApiError } from '../services/api';

export function ContentAssetEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'release-notes',
    content: '',
    status: 'draft',
  });

  useEffect(() => {
    const loadContentAsset = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const contentAsset = await contentAssetService.get(parseInt(id));
        setFormData({
          title: contentAsset.title || '',
          description: contentAsset.description || '',
          content_type: contentAsset.content_type || 'release-notes',
          content: contentAsset.content || '',
          status: contentAsset.status || 'draft',
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load content asset. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadContentAsset();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await contentAssetService.update(parseInt(id), formData);
      navigate('/workspace/content-automation');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update content asset. Please try again.');
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
        <h1 className="mb-2">Edit Content Asset</h1>
        <p className="text-slate-600">Update content asset</p>
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
              className="min-h-24"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content_type">Content Type</Label>
              <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="release-notes">Release Notes</SelectItem>
                  <SelectItem value="sales-deck">Sales Deck</SelectItem>
                  <SelectItem value="email-template">Email Template</SelectItem>
                  <SelectItem value="social-copy">Social Copy</SelectItem>
                  <SelectItem value="blog-draft">Blog Draft</SelectItem>
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-48"
              placeholder="Enter content here..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Updating...' : 'Update Content Asset'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/content-automation')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

