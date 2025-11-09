import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { userPersonaService } from '../services/researchService';
import { ApiError } from '../services/api';

export function UserPersonaEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    persona_name: '',
  });

  useEffect(() => {
    const loadUserPersona = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const persona = await userPersonaService.get(parseInt(id));
        setFormData({
          title: persona.title || '',
          description: persona.description || '',
          persona_name: persona.persona_name || '',
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load user persona. Please try again.');
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadUserPersona();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);

    try {
      await userPersonaService.update(parseInt(id), formData);
      navigate('/workspace/personas');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update user persona. Please try again.');
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
        <h1 className="mb-2">Edit User Persona</h1>
        <p className="text-slate-600">Update user persona</p>
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
            <Label htmlFor="persona_name">Persona Name</Label>
            <Input
              id="persona_name"
              value={formData.persona_name}
              onChange={(e) => setFormData({ ...formData, persona_name: e.target.value })}
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Updating...' : 'Update User Persona'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/personas')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

