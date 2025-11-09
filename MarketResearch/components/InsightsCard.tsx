import React from 'react';
import { Insights } from '../types/research.types';
import Card from './Card';
import './InsightsCard.css';

interface InsightsCardProps {
  data: Insights;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ data }) => {
  const getPriorityClass = (priority: number) => {
    if (priority <= 2) return 'priority-high';
    if (priority <= 4) return 'priority-medium';
    return 'priority-low';
  };

  return (
    <Card 
      className="insights-card"
      ariaLabel="Insights and Recommendations Section"
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">💡</span>
        <h2>Insights & Recommendations</h2>
      </div>

      <div className="card-content">
        {/* Interpretation */}
        {data.interpretation.length > 0 && (
          <section className="insights-section">
            <h3>Key Interpretations</h3>
            <ul className="interpretation-list">
              {data.interpretation.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Target Segments */}
        {data.targetSegments.length > 0 && (
          <section className="insights-section">
            <h3>Priority Target Segments</h3>
            <div className="segments-list">
              {data.targetSegments
                .sort((a, b) => a.priority - b.priority)
                .map((segment, index) => (
                  <div key={index} className="segment-item">
                    <div className="segment-header">
                      <h4>{segment.segment}</h4>
                      <span className={`priority-badge ${getPriorityClass(segment.priority)}`}>
                        Priority #{segment.priority}
                      </span>
                    </div>
                    <p className="segment-rationale">{segment.rationale}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Positioning Strategy */}
        <section className="insights-section">
          <h3>Positioning Strategy</h3>
          <div className="positioning-content">
            <p className="strategy-text">{data.positioning.strategy}</p>
            {data.positioning.differentiators.length > 0 && (
              <div className="differentiators">
                <h4>Key Differentiators</h4>
                <div className="differentiator-tags">
                  {data.positioning.differentiators.map((diff, index) => (
                    <span key={index} className="differentiator-tag">{diff}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Risks */}
        {data.risks.length > 0 && (
          <section className="insights-section">
            <h3>Risks & Gaps</h3>
            <ul className="risks-list">
              {data.risks.map((risk, index) => (
                <li key={index}>
                  <span className="risk-icon" aria-hidden="true">⚠️</span>
                  {risk}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Opportunities */}
        <section className="insights-section">
          <h3>Opportunities</h3>
          <div className="opportunities-grid">
            {data.opportunities.shortTerm.length > 0 && (
              <div className="opportunity-category short-term">
                <h4><span aria-hidden="true">🚀</span> Short-Term</h4>
                <ul>
                  {data.opportunities.shortTerm.map((opp, index) => (
                    <li key={index}>{opp}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.opportunities.longTerm.length > 0 && (
              <div className="opportunity-category long-term">
                <h4><span aria-hidden="true">🎯</span> Long-Term</h4>
                <ul>
                  {data.opportunities.longTerm.map((opp, index) => (
                    <li key={index}>{opp}</li>
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

export default InsightsCard;
