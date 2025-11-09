import React from 'react';
import { MarketTrends } from '../types/research.types';
import Card from './Card';
import './MarketTrendsCard.css';

interface MarketTrendsCardProps {
  data: MarketTrends;
}

const MarketTrendsCard: React.FC<MarketTrendsCardProps> = ({ data }) => {
  const getImpactBadgeClass = (impact: 'high' | 'medium' | 'low') => {
    return `impact-badge impact-${impact}`;
  };

  const getSeverityBadgeClass = (severity: 'high' | 'medium' | 'low') => {
    return `severity-badge severity-${severity}`;
  };

  return (
    <Card 
      className="market-trends-card"
      ariaLabel="Market Trends Section"
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">📈</span>
        <h2>Market Trends</h2>
      </div>

      <div className="card-content">
        {/* Emerging Trends */}
        {data.emergingTrends.length > 0 && (
          <section className="trends-section">
            <h3>Emerging Trends</h3>
            <div className="trends-list">
              {data.emergingTrends.map((trend, index) => (
                <div key={index} className="trend-item">
                  <div className="trend-header">
                    <h4>{trend.name}</h4>
                    <span className={getImpactBadgeClass(trend.impact)}>
                      {trend.impact} impact
                    </span>
                  </div>
                  <p className="trend-description">{trend.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Unmet Needs */}
        {data.unmetNeeds.length > 0 && (
          <section className="trends-section">
            <h3>Unmet Needs & Market Gaps</h3>
            <ul className="unmet-needs-list">
              {data.unmetNeeds.map((need, index) => (
                <li key={index}>{need}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Growth Drivers */}
        <section className="trends-section">
          <h3>Growth Drivers</h3>
          <div className="growth-drivers">
            {data.growthDrivers.technological.length > 0 && (
              <div className="driver-category">
                <h4>
                  <span className="category-icon">💻</span>
                  Technological
                </h4>
                <ul>
                  {data.growthDrivers.technological.map((driver, index) => (
                    <li key={index}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.growthDrivers.social.length > 0 && (
              <div className="driver-category">
                <h4>
                  <span className="category-icon">👥</span>
                  Social
                </h4>
                <ul>
                  {data.growthDrivers.social.map((driver, index) => (
                    <li key={index}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.growthDrivers.economic.length > 0 && (
              <div className="driver-category">
                <h4>
                  <span className="category-icon">💰</span>
                  Economic
                </h4>
                <ul>
                  {data.growthDrivers.economic.map((driver, index) => (
                    <li key={index}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Barriers to Entry */}
        {data.barriersToEntry.length > 0 && (
          <section className="trends-section">
            <h3>Barriers to Entry</h3>
            <div className="barriers-list">
              {data.barriersToEntry.map((barrier, index) => (
                <div key={index} className="barrier-item">
                  <div className="barrier-header">
                    <h4>{barrier.type}</h4>
                    <span className={getSeverityBadgeClass(barrier.severity)}>
                      {barrier.severity} severity
                    </span>
                  </div>
                  <p className="barrier-description">{barrier.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Card>
  );
};

export default MarketTrendsCard;
