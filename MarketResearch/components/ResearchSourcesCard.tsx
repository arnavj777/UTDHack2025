import React from 'react';
import { ResearchSources } from '../types/research.types';
import Card from './Card';
import './ResearchSourcesCard.css';

interface ResearchSourcesCardProps {
  data: ResearchSources;
}

const ResearchSourcesCard: React.FC<ResearchSourcesCardProps> = ({ data }) => {
  return (
    <Card 
      className="research-sources-card"
      ariaLabel="Research Sources Section"
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">📚</span>
        <h2>Research Sources</h2>
      </div>

      <div className="card-content">
        {/* Primary Research */}
        <section className="sources-section">
          <h3>Primary Research</h3>
          <div className="primary-research">
            {data.primaryResearch.description && (
              <p className="research-description">{data.primaryResearch.description}</p>
            )}
            {data.primaryResearch.methods.length > 0 && (
              <div className="methods-list">
                <h4>Research Methods</h4>
                <ul>
                  {data.primaryResearch.methods.map((method, index) => (
                    <li key={index} className="method-item">
                      <span className="method-icon">🔬</span>
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Secondary Research */}
        {data.secondaryResearch.sources.length > 0 && (
          <section className="sources-section">
            <h3>Secondary Research</h3>
            <div className="secondary-research">
              <div className="sources-list">
                {data.secondaryResearch.sources.map((source, index) => (
                  <div key={index} className="source-item">
                    <div className="source-header">
                      <span className="source-type-badge">{source.type}</span>
                      <h4 className="source-name">{source.name}</h4>
                    </div>
                    {source.description && (
                      <p className="source-description">{source.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Card>
  );
};

export default ResearchSourcesCard;
