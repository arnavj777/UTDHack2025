import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Progress } from './ui/progress';

export function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    industry: '',
    template: '',
    aiTone: 'professional',
    import: false
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/workspace/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl">ProductAI</span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-slate-600">Step {step} of {totalSteps}</span>
            <span className="text-slate-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Step 1: Product Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Let's set up your first product</h2>
              <p className="text-slate-600">
                Tell us about the product you're managing
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input 
                id="productName" 
                placeholder="e.g., Mobile Banking App"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
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
              <p className="text-slate-500">This helps us apply relevant compliance and regulatory context</p>
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Choose your workflow template</h2>
              <p className="text-slate-600">
                Select the framework that best fits your team
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { value: 'agile', name: 'Agile / Scrum', desc: 'Sprints, user stories, and iterative development' },
                { value: 'kanban', name: 'Kanban', desc: 'Continuous flow and WIP limits' },
                { value: 'dual-track', name: 'Dual-Track Agile', desc: 'Discovery and delivery in parallel' },
                { value: 'safe', name: 'SAFe', desc: 'Scaled agile framework for enterprises' },
                { value: 'custom', name: 'Custom', desc: 'Start from scratch and build your own' }
              ].map((template) => (
                <Card 
                  key={template.value}
                  className={`p-4 cursor-pointer transition-all ${
                    formData.template === template.value 
                      ? 'border-blue-600 border-2 bg-blue-50' 
                      : 'hover:border-blue-300'
                  }`}
                  onClick={() => setFormData({...formData, template: template.value})}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      formData.template === template.value ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {formData.template === template.value && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="mb-1">{template.name}</div>
                      <p className="text-slate-600">{template.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: AI Personalization */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Personalize your AI assistant</h2>
              <p className="text-slate-600">
                Customize how the AI helps you work
              </p>
            </div>

            <div className="space-y-2">
              <Label>AI Communication Style</Label>
              <Select value={formData.aiTone} onValueChange={(value) => setFormData({...formData, aiTone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise - Quick, actionable suggestions</SelectItem>
                  <SelectItem value="professional">Professional - Balanced and thorough</SelectItem>
                  <SelectItem value="detailed">Detailed - In-depth explanations</SelectItem>
                  <SelectItem value="creative">Creative - Innovative ideas and alternatives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="mb-3">AI Assistant Capabilities</h4>
              <div className="space-y-3">
                {[
                  { label: 'Auto-generate user stories from ideas', checked: true },
                  { label: 'Suggest priorities based on business impact', checked: true },
                  { label: 'Detect duplicate or similar work items', checked: true },
                  { label: 'Weekly strategic insights and recommendations', checked: false },
                  { label: 'Automated sprint planning suggestions', checked: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Checkbox id={`ai-${i}`} defaultChecked={item.checked} />
                    <label htmlFor={`ai-${i}`} className="cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Import Data */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Import existing work (optional)</h2>
              <p className="text-slate-600">
                Bring in your roadmap and backlog from other tools
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { name: 'Jira', logo: '🔷' },
                { name: 'Linear', logo: '◆' },
                { name: 'Asana', logo: '🔺' },
                { name: 'CSV Upload', logo: '📄' },
                { name: 'Start Fresh', logo: '✨' }
              ].map((option) => (
                <Card 
                  key={option.name}
                  className="p-4 cursor-pointer hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{option.logo}</div>
                    <div>
                      <div>{option.name}</div>
                      {option.name !== 'Start Fresh' && (
                        <p className="text-slate-500">Import roadmaps, epics, and user stories</p>
                      )}
                    </div>
                    <Button variant="outline" className="ml-auto">
                      {option.name === 'Start Fresh' ? 'Continue' : 'Connect'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center text-slate-500">
              You can always import data later from Settings
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {step === totalSteps ? 'Get Started' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
