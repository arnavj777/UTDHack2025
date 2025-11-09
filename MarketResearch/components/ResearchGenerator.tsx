import React, { useState } from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './ResearchGenerator.css';

interface ResearchGeneratorProps {
  onGenerate: (topic: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const ResearchGenerator: React.FC<ResearchGeneratorProps> = ({
  onGenerate,
  isLoading,
  error,
}) => {
  const [topic, setTopic] = useState('coding project management tools');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      return;
    }
    try {
      await onGenerate(topic.trim());
    } catch (err) {
      // Error is handled by parent component
      console.error('Error generating research:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && topic.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="research-generator">
      <header className="research-generator__header">
        <h1 className="research-generator__title">Market Research Tool</h1>
        <p className="research-generator__description">
          Generate comprehensive market research reports using AI
        </p>
      </header>

      <div className="research-generator__form">
        <div className="research-generator__input-group">
          <label 
            htmlFor="research-topic" 
            className="research-generator__label"
          >
            Research Topic
          </label>
          <input
            id="research-topic"
            type="text"
            className="research-generator__input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., AI-powered healthcare solutions"
            disabled={isLoading}
            aria-label="Enter research topic"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          isLoading={isLoading}
          className="research-generator__button"
          ariaLabel="Generate comprehensive market research report"
        >
          Generate Market Research
        </Button>
      </div>

      {isLoading && (
        <div 
          className="research-generator__loading"
          role="status"
          aria-live="polite"
        >
          <LoadingSpinner 
            size="large" 
            ariaLabel="Generating market research report"
          />
          <p className="research-generator__loading-text">
            Generating your market research report...
          </p>
          <p className="research-generator__loading-subtext">
            This may take up to 30 seconds
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="research-generator__error">
          <ErrorMessage
            message={error}
            onRetry={handleGenerate}
          />
        </div>
      )}
    </div>
  );
};

export default ResearchGenerator;
