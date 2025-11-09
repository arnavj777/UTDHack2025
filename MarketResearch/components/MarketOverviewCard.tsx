import React from 'react';
import { MarketOverview } from '../types/research.types';
import Card from './Card';
import './MarketOverviewCard.css';

interface MarketOverviewCardProps {
  data: MarketOverview;
}

const MarketOverviewCard: React.FC<MarketOverviewCardProps> = ({ data }) => {
  return (
    <Card 
      className="market-overview-card"
      ariaLabel="Market Overview Section"
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">📊</span>
        <h2>Market Overview</h2>
      </div>

      <div className="card-content">
        {/* Industry Description */}
        <section className="overview-section">
          <h3>Industry Description</h3>
          <div className="industry-details">
            <div className="detail-item">
              <span className="label">Size:</span>
              <span className="value">{data.industryDescription.size}</span>
            </div>
            <div className="detail-item">
              <span className="label">Maturity:</span>
              <span className={`badge maturity-${data.industryDescription.maturity}`}>
                {data.industryDescription.maturity}
              </span>
            </div>
            {data.industryDescription.keyTrends.length > 0 && (
              <div className="detail-item">
                <span className="label">Key Trends:</span>
                <ul className="trends-list">
                  {data.industryDescription.keyTrends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Market Size */}
        <section className="overview-section">
          <h3>Market Size</h3>
          <div className="market-size-grid">
            <div className="size-metric">
              <div className="metric-label">TAM</div>
              <div className="metric-value">{data.marketSize.tam}</div>
              <div className="metric-description">Total Addressable Market</div>
            </div>
            <div className="size-metric">
              <div className="metric-label">SAM</div>
              <div className="metric-value">{data.marketSize.sam}</div>
              <div className="metric-description">Serviceable Available Market</div>
            </div>
            <div className="size-metric">
              <div className="metric-label">SOM</div>
              <div className="metric-value">{data.marketSize.som}</div>
              <div className="metric-description">Serviceable Obtainable Market</div>
            </div>
          </div>
        </section>

        {/* Growth Rate */}
        <section className="overview-section">
          <h3>Growth Rate</h3>
          <div className="growth-metrics">
            <div className="growth-item">
              <span className="label">CAGR:</span>
              <span className="value highlight">{data.growthRate.cagr}</span>
            </div>
            <div className="growth-item">
              <span className="label">YoY Growth:</span>
              <span className="value highlight">{data.growthRate.yoyGrowth}</span>
            </div>
          </div>
        </section>

        {/* Regulatory Factors */}
        {data.regulatoryFactors.length > 0 && (
          <section className="overview-section">
            <h3>Regulatory Factors</h3>
            <ul className="regulatory-list">
              {data.regulatoryFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Card>
  );
};

export default MarketOverviewCard;
