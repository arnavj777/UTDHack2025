import React from 'react';
import { TargetAudience } from '../types/research.types';
import Card from './Card';
import './TargetAudienceCard.css';

interface TargetAudienceCardProps {
  data: TargetAudience;
}

const TargetAudienceCard: React.FC<TargetAudienceCardProps> = ({ data }) => {
  return (
    <Card 
      className="target-audience-card"
      ariaLabel="Target Audience Analysis Section"
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">👥</span>
        <h2>Target Audience</h2>
      </div>

      <div className="card-content">
        {/* Demographics */}
        <section className="audience-section">
          <h3>Demographics</h3>
          <div className="demographics-grid">
            <div className="demo-item">
              <span className="label">Age:</span>
              <span className="value">{data.demographics.age}</span>
            </div>
            <div className="demo-item">
              <span className="label">Gender:</span>
              <span className="value">{data.demographics.gender}</span>
            </div>
            <div className="demo-item">
              <span className="label">Income:</span>
              <span className="value">{data.demographics.income}</span>
            </div>
            <div className="demo-item">
              <span className="label">Education:</span>
              <span className="value">{data.demographics.education}</span>
            </div>
            {data.demographics.occupation.length > 0 && (
              <div className="demo-item full-width">
                <span className="label">Occupation:</span>
                <span className="value">{data.demographics.occupation.join(', ')}</span>
              </div>
            )}
          </div>
        </section>

        {/* Psychographics */}
        <section className="audience-section">
          <h3>Psychographics</h3>
          <div className="psycho-content">
            {data.psychographics.interests.length > 0 && (
              <div className="psycho-item">
                <h4>Interests</h4>
                <div className="tag-list">
                  {data.psychographics.interests.map((interest, index) => (
                    <span key={index} className="tag">{interest}</span>
                  ))}
                </div>
              </div>
            )}
            {data.psychographics.values.length > 0 && (
              <div className="psycho-item">
                <h4>Values</h4>
                <div className="tag-list">
                  {data.psychographics.values.map((value, index) => (
                    <span key={index} className="tag">{value}</span>
                  ))}
                </div>
              </div>
            )}
            {data.psychographics.motivations.length > 0 && (
              <div className="psycho-item">
                <h4>Motivations</h4>
                <div className="tag-list">
                  {data.psychographics.motivations.map((motivation, index) => (
                    <span key={index} className="tag">{motivation}</span>
                  ))}
                </div>
              </div>
            )}
            {data.psychographics.lifestyle && (
              <div className="psycho-item">
                <h4>Lifestyle</h4>
                <p>{data.psychographics.lifestyle}</p>
              </div>
            )}
          </div>
        </section>

        {/* Behavioral Data */}
        <section className="audience-section">
          <h3>Behavioral Data</h3>
          <div className="behavioral-content">
            {data.behavioralData.purchaseHabits.length > 0 && (
              <div className="behavior-item">
                <span className="label">Purchase Habits:</span>
                <ul>
                  {data.behavioralData.purchaseHabits.map((habit, index) => (
                    <li key={index}>{habit}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="behavior-item">
              <span className="label">Usage Frequency:</span>
              <span className="value">{data.behavioralData.usageFrequency}</span>
            </div>
            <div className="behavior-item">
              <span className="label">Brand Loyalty:</span>
              <span className="value">{data.behavioralData.brandLoyalty}</span>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        {data.painPoints.length > 0 && (
          <section className="audience-section">
            <h3>Pain Points</h3>
            <ul className="pain-points-list">
              {data.painPoints.map((point, index) => (
                <li key={index}>
                  <span className="pain-icon" aria-hidden="true">⚠️</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Customer Segments */}
        {data.customerSegments.length > 0 && (
          <section className="audience-section">
            <h3>Customer Segments</h3>
            <div className="segments-grid">
              {data.customerSegments.map((segment, index) => (
                <div key={index} className="segment-card">
                  <h4>{segment.name}</h4>
                  <p className="segment-description">{segment.description}</p>
                  <div className="segment-size">
                    <span className="label">Size:</span>
                    <span className="value">{segment.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Card>
  );
};

export default TargetAudienceCard;
