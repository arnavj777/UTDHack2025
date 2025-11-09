import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { researchDocumentService } from '../services/researchService';
import { ApiError } from '../services/api';

export function ResearchDocumentEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'research',
    content: '',
  });

  useEffect(() => {
    const loadResearchDocument = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const doc = await researchDocumentService.get(parseInt(id));
        setFormData({
          title: doc.title || '',
          description: doc.description || '',
          document_type: doc.document_type || 'research',
          content: doc.content || '',
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load research document. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadResearchDocument();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await researchDocumentService.update(parseInt(id), formData);
      navigate('/workspace/research');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update research document. Please try again.');
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
        <h1 className="mb-2">Edit Research Document</h1>
        <p className="text-slate-600">Update research document</p>
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

          <div className="space-y-2">
            <Label htmlFor="document_type">Document Type</Label>
            <Select value={formData.document_type} onValueChange={(value) => setFormData({ ...formData, document_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="study">Study</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-48"
              placeholder="Enter research content..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Updating...' : 'Update Research Document'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/research')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

