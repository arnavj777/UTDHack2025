import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { roadmapService } from '../services/developmentService';
import { ApiError } from '../services/api';

export function RoadmapCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active',
    start_date: '',
    end_date: '',
    data: {
      quarters: [],
      timelineView: [],
      dependencies: []
    }
  });
  const [dataJson, setDataJson] = useState('{\n  "quarters": [],\n  "timelineView": [],\n  "dependencies": []\n}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Parse JSON data
      let parsedData = {};
      if (dataJson.trim()) {
        try {
          parsedData = JSON.parse(dataJson);
        } catch (parseError) {
          setError('Invalid JSON in roadmap data. Please check the format.');
          setLoading(false);
          return;
        }
      }

      const submitData = {
        ...formData,
        data: parsedData
      };

      await roadmapService.create(submitData);
      navigate('/workspace/roadmap');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create roadmap. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Create Roadmap</h1>
        <p className="text-slate-600">Add a new product roadmap</p>
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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Roadmap Data (JSON)</Label>
            <Textarea
              id="data"
              value={dataJson}
              onChange={(e) => setDataJson(e.target.value)}
              className="min-h-48 font-mono text-sm"
              placeholder='{"quarters": [], "timelineView": [], "dependencies": []}'
            />
            <p className="text-xs text-slate-500">
              Optional: Add roadmap structure as JSON. Include quarters, timelineView, and dependencies arrays.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Creating...' : 'Create Roadmap'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/workspace/roadmap')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

