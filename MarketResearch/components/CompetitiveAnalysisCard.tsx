import React from 'react';
import { CompetitiveAnalysis } from '../types/research.types';
import Card from './Card';
import './CompetitiveAnalysisCard.css';

interface CompetitiveAnalysisCardProps {
  data: CompetitiveAnalysis;
}

const CompetitiveAnalysisCard: React.FC<CompetitiveAnalysisCardProps> = ({ data }) => {
  return (
    <Card 
      className="competitive-analysis-card"
      ariaLabel="Competitive Analysis Section"
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">⚔️</span>
        <h2>Competitive Analysis</h2>
      </div>

      <div className="card-content">
        {/* Direct Competitors */}
        {data.directCompetitors.length > 0 && (
          <section className="analysis-section">
            <h3>Direct Competitors</h3>
            <div className="competitors-list">
              {data.directCompetitors.map((competitor, index) => (
                <div key={index} className="competitor-item">
                  <h4>{competitor.name}</h4>
                  <p className="competitor-description">{competitor.description}</p>
                  <span className="market-position">{competitor.marketPosition}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Indirect Competitors */}
        {data.indirectCompetitors.length > 0 && (
          <section className="analysis-section">
            <h3>Indirect Competitors</h3>
            <div className="competitors-list">
              {data.indirectCompetitors.map((competitor, index) => (
                <div key={index} className="competitor-item indirect">
                  <h4>{competitor.name}</h4>
                  <p className="competitor-description">{competitor.description}</p>
                  <span className="market-position">{competitor.marketPosition}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Market Share */}
        {data.marketShare.length > 0 && (
          <section className="analysis-section">
            <h3>Market Share</h3>
            <div className="market-share-list">
              {data.marketShare.map((share, index) => (
                <div key={index} className="share-item">
                  <span className="competitor-name">{share.competitor}</span>
                  <span className="share-value">{share.share}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SWOT Analysis */}
        <section className="analysis-section">
          <h3>SWOT Analysis</h3>
          <div className="swot-grid">
            <div className="swot-quadrant strengths">
              <h4>💪 Strengths</h4>
              <ul>
                {data.swotAnalysis.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="swot-quadrant weaknesses">
              <h4>⚠️ Weaknesses</h4>
              <ul>
                {data.swotAnalysis.weaknesses.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="swot-quadrant opportunities">
              <h4>🎯 Opportunities</h4>
              <ul>
                {data.swotAnalysis.opportunities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="swot-quadrant threats">
              <h4>🚨 Threats</h4>
              <ul>
                {data.swotAnalysis.threats.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="analysis-section">
          <h3>Competitive Comparison</h3>
          <div className="comparison-content">
            {data.comparison.pricing.length > 0 && (
              <div className="comparison-item">
                <h4>Pricing</h4>
                <ul>
                  {data.comparison.pricing.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.comparison.features.length > 0 && (
              <div className="comparison-item">
                <h4>Features</h4>
                <ul>
                  {data.comparison.features.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.comparison.marketing.length > 0 && (
              <div className="comparison-item">
                <h4>Marketing</h4>
                <ul>
                  {data.comparison.marketing.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </Card>
  );
};

export default CompetitiveAnalysisCard;
