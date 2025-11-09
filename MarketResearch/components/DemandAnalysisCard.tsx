import React from 'react';
import { DemandAnalysis } from '../types/research.types';
import Card from './Card';
import './DemandAnalysisCard.css';

interface DemandAnalysisCardProps {
  data: DemandAnalysis;
}

const DemandAnalysisCard: React.FC<DemandAnalysisCardProps> = ({ data }) => {
  // Helper function to parse readiness score and determine visual indicator
  const getReadinessIndicator = (score: string) => {
    const numericScore = parseFloat(score);
    if (!isNaN(numericScore)) {
      if (numericScore >= 8) return { class: 'high', label: 'High' };
      if (numericScore >= 5) return { class: 'medium', label: 'Medium' };
      return { class: 'low', label: 'Low' };
    }
    // Handle text-based scores
    const lowerScore = score.toLowerCase();
    if (lowerScore.includes('high') || lowerScore.includes('ready')) {
      return { class: 'high', label: 'High' };
    }
    if (lowerScore.includes('medium') || lowerScore.includes('moderate')) {
      return { class: 'medium', label: 'Medium' };
    }
    return { class: 'low', label: 'Low' };
  };

  const readinessIndicator = getReadinessIndicator(data.marketReadiness.score);

  return (
    <Card 
      className="demand-analysis-card"
      ariaLabel="Demand Analysis Section"
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">📊</span>
        <h2>Demand Analysis</h2>
      </div>

      <div className="card-content">
        {/* Historical Demand */}
        <section className="demand-section">
          <h3>Historical Demand</h3>
          <div className="historical-demand">
            {data.historicalDemand.trends.length > 0 && (
              <div className="demand-subsection">
                <h4>Trends</h4>
                <ul className="trends-list">
                  {data.historicalDemand.trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.historicalDemand.seasonalEffects.length > 0 && (
              <div className="demand-subsection">
                <h4>Seasonal Effects</h4>
                <ul className="seasonal-list">
                  {data.historicalDemand.seasonalEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Adoption Curve */}
        <section className="demand-section">
          <h3>Adoption Curve</h3>
          <div className="adoption-curve">
            <div className="adoption-stage">
              <span className="stage-label">Current Stage:</span>
              <span className="stage-value">{data.adoptionCurve.currentStage}</span>
            </div>
            <p className="adoption-description">{data.adoptionCurve.description}</p>
          </div>
        </section>

        {/* Market Readiness */}
        <section className="demand-section">
          <h3>Market Readiness</h3>
          <div className="market-readiness">
            <div className="readiness-score">
              <span className="score-label">Readiness Score:</span>
              <span className={`score-value ${readinessIndicator.class}`}>
                {data.marketReadiness.score}
              </span>
              <span className={`readiness-indicator ${readinessIndicator.class}`}>
                {readinessIndicator.label}
              </span>
            </div>
            {data.marketReadiness.factors.length > 0 && (
              <div className="readiness-factors">
                <h4>Key Factors</h4>
                <ul>
                  {data.marketReadiness.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Elasticity */}
        <section className="demand-section">
          <h3>Demand Elasticity</h3>
          <div className="elasticity-metrics">
            <div className="elasticity-item">
              <div className="metric-header">
                <span className="metric-icon">💰</span>
                <h4>Price Elasticity</h4>
              </div>
              <p className="metric-value">{data.elasticity.priceElasticity}</p>
            </div>
            <div className="elasticity-item">
              <div className="metric-header">
                <span className="metric-icon">⚙️</span>
                <h4>Feature Elasticity</h4>
              </div>
              <p className="metric-value">{data.elasticity.featureElasticity}</p>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
};

export default DemandAnalysisCard;
