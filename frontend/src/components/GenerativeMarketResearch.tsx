import { useState, useEffect } from 'react';
import { MarketResearchGenerator } from './MarketResearchGenerator';
import { MarketResearchDisplay } from './MarketResearchDisplay';
import { Button } from './ui/button';
import { initializeGeminiService, generateMarketResearch } from '../services/marketResearchService';
import { exportToPDF } from '../utils/pdfExport';
import type { ResearchData, ErrorState } from '../types/MarketResearch.types';
import { Download } from 'lucide-react';

export function GenerativeMarketResearch() {
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  // Initialize Gemini service on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError({
        type: 'api',
        message: 'API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.',
        retryable: false,
      });
      return;
    }

    try {
      initializeGeminiService(apiKey);
      console.log('Gemini service initialized successfully');
    } catch (err) {
      console.error('Failed to initialize Gemini service:', err);
      setError({
        type: 'api',
        message: 'Failed to initialize API service. Please check your configuration.',
        retryable: false,
      });
    }
  }, []);

  // Handler for generating research
  const handleGenerateResearch = async (topic: string): Promise<void> => {
    setError(null);
    setCurrentTopic(topic);
    setIsLoading(true);

    try {
      const result = await generateMarketResearch(topic);

      if (result.error) {
        setError(result.error);
        setResearchData(null);
      } else if (result.data) {
        setResearchData(result.data);
        setError(null);
      } else {
        setError({
          type: 'unknown',
          message: 'No data received from the service. Please try again.',
          retryable: true,
        });
      }
    } catch (err) {
      console.error('Unexpected error during research generation:', err);
      setError({
        type: 'unknown',
        message: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
        retryable: true,
      });
      setResearchData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for PDF export
  const handleExportPDF = () => {
    if (researchData && currentTopic) {
      exportToPDF(researchData, currentTopic);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Generative Market Research</h1>
        <p className="text-slate-600">
          Generate comprehensive market research reports using AI-powered analysis
        </p>
      </div>

      {/* Research Generator Section */}
      <MarketResearchGenerator
        onGenerate={handleGenerateResearch}
        isLoading={isLoading}
        error={error?.message || null}
      />

      {/* Research Display Section */}
      {!isLoading && !error && researchData && (
        <section aria-label="Market Research Results">
          <div className="flex justify-end mb-6">
            <Button
              onClick={handleExportPDF}
              variant="secondary"
              aria-label="Download research report as PDF"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
          <MarketResearchDisplay data={researchData} />
        </section>
      )}
    </div>
  );
}

