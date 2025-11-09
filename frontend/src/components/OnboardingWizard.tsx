import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function OnboardingWizard() {
  const navigate = useNavigate();
  const { user, completeOnboarding, updatePreferences } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    industry: ''
  });

  // Load existing preferences if user has completed onboarding
  useEffect(() => {
    if (user?.onboarding_completed) {
      // If onboarding is already completed, redirect to dashboard
      navigate('/workspace/dashboard');
      return;
    }
    
    // Load existing preferences if user has partial onboarding data
    if (user?.onboarding_data) {
      const existingData = user.onboarding_data;
      setFormData({
        organizationName: existingData.organizationName || '',
        industry: existingData.industry || ''
      });
    }
    
    // Also load from preferences if available
    if (user?.preferences) {
      setFormData(prev => ({
        ...prev,
        organizationName: user.preferences.organizationName || prev.organizationName,
        industry: user.preferences.industry || prev.industry
      }));
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizationName || !formData.industry) {
      return;
    }

    setLoading(true);
    try {
      // Save onboarding data
      await completeOnboarding({
        organizationName: formData.organizationName,
        industry: formData.industry
      });

      // Also save as preferences for easy access
      await updatePreferences({
        organizationName: formData.organizationName,
        industry: formData.industry
      });

      navigate('/workspace/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      // Still navigate even if save fails
      navigate('/workspace/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl">ProductAI</span>
        </div>

        <div className="mb-6">
          <h2 className="mb-2">Welcome to ProductAI</h2>
          <p className="text-slate-600">
            Let's set up your organization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input 
              id="organizationName" 
              placeholder="e.g., Acme Corp"
              value={formData.organizationName}
              onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry Type</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banking">Banking & Financial Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-slate-500 text-sm">This helps us apply relevant compliance and regulatory context</p>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading || !formData.organizationName || !formData.industry}>
            {loading ? 'Saving...' : 'Get Started'} <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
