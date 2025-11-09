import React, { useState, useEffect } from 'react';
import ResearchGenerator from './components/ResearchGenerator';
import ResearchDisplay from './components/ResearchDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/Button';
import { initializeGeminiService, generateMarketResearch } from './services/geminiService';
import { exportToPDF } from './utils/pdfExport';
import type { ResearchData, ErrorState } from './types/research.types';
import './App.css';

// ============================================================================
// Main App Component
// ============================================================================

const App: React.FC = () => {
  // State management for research data, loading, and errors
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  // Initialize Gemini service on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Debug logging
    console.log('API Key present:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    
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
    // Clear previous error
    setError(null);
    setCurrentTopic(topic);
    
    // Set loading state
    setIsLoading(true);

    try {
      // Call Gemini service to generate research
      const result = await generateMarketResearch(topic);

      if (result.error) {
        // Handle error from service
        setError(result.error);
        setResearchData(null);
      } else if (result.data) {
        // Successfully generated research
        setResearchData(result.data);
        setError(null);
      } else {
        // Unexpected case: no data and no error
        setError({
          type: 'unknown',
          message: 'No data received from the service. Please try again.',
          retryable: true,
        });
      }
    } catch (err) {
      // Handle unexpected errors
      console.error('Unexpected error during research generation:', err);
      setError({
        type: 'unknown',
        message: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
        retryable: true,
      });
      setResearchData(null);
    } finally {
      // Always clear loading state
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
    <ErrorBoundary>
      <div className="app">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <div className="app__container">
          <main id="main-content" className="app__content" role="main">
            {/* Research Generator Section */}
            <ResearchGenerator
              onGenerate={handleGenerateResearch}
              isLoading={isLoading}
              error={error?.message || null}
            />

            {/* Research Display Section */}
            {!isLoading && !error && researchData && (
              <section aria-label="Market Research Results">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px', maxWidth: '1200px', margin: '0 auto 24px' }}>
                  <Button
                    onClick={handleExportPDF}
                    variant="secondary"
                    ariaLabel="Download research report as PDF"
                  >
                    📄 Download PDF
                  </Button>
                </div>
                <ResearchDisplay data={researchData} />
              </section>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
