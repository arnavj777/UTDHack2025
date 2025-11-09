import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2 } from 'lucide-react';

interface MarketResearchGeneratorProps {
  onGenerate: (topic: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function MarketResearchGenerator({
  onGenerate,
  isLoading,
  error,
}: MarketResearchGeneratorProps) {
  const [topic, setTopic] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      return;
    }
    try {
      await onGenerate(topic.trim());
    } catch (err) {
      console.error('Error generating research:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && topic.trim()) {
      handleGenerate();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Research Tool</CardTitle>
        <CardDescription>
          Generate comprehensive market research reports using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="research-topic" 
            className="text-sm font-medium"
          >
            Research Topic
          </label>
          <Input
            id="research-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., AI-powered healthcare solutions"
            disabled={isLoading}
            aria-label="Enter research topic"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full"
          aria-label="Generate comprehensive market research report"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Market Research'
          )}
        </Button>

        {isLoading && (
          <div 
            className="flex flex-col items-center justify-center py-8 space-y-2"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-600">
              Generating your market research report...
            </p>
            <p className="text-xs text-slate-500">
              This may take up to 30 seconds
            </p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

