import jsPDF from 'jspdf';
import type { ResearchData } from '../types/MarketResearch.types';

/**
 * Exports research data to a PDF file
 */
export function exportToPDF(data: ResearchData, topic: string): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper to add new page if needed
  const checkPageBreak = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Helper to add text with word wrap
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = pdf.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak();
      pdf.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 3;
  };

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Market Research Report', margin, yPosition);
  yPosition += 15;

  // Topic
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Topic: ${topic}`, margin, yPosition);
  yPosition += 10;

  // Date
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Market Overview
  addText('1. MARKET OVERVIEW', 16, true);
  addText(`Industry: ${data.marketOverview.industryDescription.size || 'N/A'}`);
  addText(`Maturity: ${data.marketOverview.industryDescription.maturity || 'N/A'}`);
  addText('Key Trends:', 12, true);
  data.marketOverview.industryDescription.keyTrends.forEach((trend) => {
    addText(`• ${trend}`);
  });
  yPosition += 5;

  addText('Market Size:', 12, true);
  addText(`TAM: ${data.marketOverview.marketSize.tam || 'N/A'}`);
  addText(`SAM: ${data.marketOverview.marketSize.sam || 'N/A'}`);
  addText(`SOM: ${data.marketOverview.marketSize.som || 'N/A'}`);
  yPosition += 5;

  addText('Growth Rate:', 12, true);
  addText(`CAGR: ${data.marketOverview.growthRate.cagr || 'N/A'}`);
  addText(`YoY Growth: ${data.marketOverview.growthRate.yoyGrowth || 'N/A'}`);
  yPosition += 10;

  // Target Audience
  checkPageBreak(20);
  addText('2. TARGET AUDIENCE', 16, true);
  addText('Demographics:', 12, true);
  addText(`Age: ${data.targetAudience.demographics.age}`);
  addText(`Gender: ${data.targetAudience.demographics.gender}`);
  addText(`Income: ${data.targetAudience.demographics.income}`);
  addText(`Education: ${data.targetAudience.demographics.education}`);
  yPosition += 5;

  addText('Pain Points:', 12, true);
  data.targetAudience.painPoints.forEach((pain: string) => {
    addText(`• ${pain}`);
  });
  yPosition += 5;

  addText('Customer Segments:', 12, true);
  data.targetAudience.customerSegments.forEach((segment) => {
    addText(`• ${segment.name}: ${segment.description}`);
  });
  yPosition += 10;

  // Competitive Analysis
  checkPageBreak(20);
  addText('3. COMPETITIVE ANALYSIS', 16, true);
  addText('Direct Competitors:', 12, true);
  data.competitiveAnalysis.directCompetitors.forEach((comp) => {
    addText(`• ${comp.name}: ${comp.description}`);
  });
  yPosition += 5;

  addText('SWOT Analysis:', 12, true);
  addText(`Strengths: ${data.competitiveAnalysis.swotAnalysis.strengths.join(', ')}`);
  addText(`Weaknesses: ${data.competitiveAnalysis.swotAnalysis.weaknesses.join(', ')}`);
  addText(`Opportunities: ${data.competitiveAnalysis.swotAnalysis.opportunities.join(', ')}`);
  addText(`Threats: ${data.competitiveAnalysis.swotAnalysis.threats.join(', ')}`);
  yPosition += 10;

  // Market Trends
  checkPageBreak(20);
  addText('4. MARKET TRENDS', 16, true);
  addText('Emerging Trends:', 12, true);
  data.marketTrends.emergingTrends.forEach((trend) => {
    addText(`• ${trend.name}: ${trend.description}`);
  });
  yPosition += 5;

  addText('Growth Drivers:', 12, true);
  addText('Technological:', 11, true);
  data.marketTrends.growthDrivers.technological.forEach((driver: string) => {
    addText(`• ${driver}`);
  });
  addText('Social:', 11, true);
  data.marketTrends.growthDrivers.social.forEach((driver: string) => {
    addText(`• ${driver}`);
  });
  yPosition += 10;

  // Demand Analysis
  checkPageBreak(20);
  addText('5. DEMAND ANALYSIS', 16, true);
  addText(`Adoption Curve: ${data.demandAnalysis.adoptionCurve.currentStage || 'N/A'}`);
  addText(`Description: ${data.demandAnalysis.adoptionCurve.description || 'N/A'}`);
  addText(`Market Readiness Score: ${data.demandAnalysis.marketReadiness.score || 'N/A'}`);
  yPosition += 10;

  // Research Sources
  checkPageBreak(20);
  addText('6. RESEARCH SOURCES', 16, true);
  addText('Primary Research:', 12, true);
  addText(data.researchSources.primaryResearch.description);
  data.researchSources.primaryResearch.methods.forEach((method: string) => {
    addText(`• ${method}`);
  });
  yPosition += 5;

  addText('Secondary Research:', 12, true);
  data.researchSources.secondaryResearch.sources.forEach((source) => {
    addText(`• ${source.name} (${source.type})`);
  });
  yPosition += 10;

  // Insights
  checkPageBreak(20);
  addText('7. INSIGHTS AND RECOMMENDATIONS', 16, true);
  addText('Target Segments Priority:', 12, true);
  data.insights.targetSegments.forEach((segment) => {
    addText(`• ${segment.segment} (Priority: ${segment.priority}) - ${segment.rationale}`);
  });
  yPosition += 5;

  addText('Positioning Strategy:', 12, true);
  addText(data.insights.positioning.strategy);
  addText('Differentiators:', 11, true);
  data.insights.positioning.differentiators.forEach((diff: string) => {
    addText(`• ${diff}`);
  });
  yPosition += 5;

  addText('Opportunities:', 12, true);
  addText('Short-term:', 11, true);
  data.insights.opportunities.shortTerm.forEach((opp: string) => {
    addText(`• ${opp}`);
  });
  addText('Long-term:', 11, true);
  data.insights.opportunities.longTerm.forEach((opp: string) => {
    addText(`• ${opp}`);
  });

  // Save the PDF
  const fileName = `market-research-${topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
  pdf.save(fileName);
}

