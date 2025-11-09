// Response Parser Utilities for Gemini API responses
// Handles parsing of text-based research reports into structured TypeScript objects

import type {
  ResearchData,
  MarketOverview,
  TargetAudience,
  CompetitiveAnalysis,
  MarketTrends,
  DemandAnalysis,
  ResearchSources,
  Insights,
  Competitor,
  CustomerSegment,
  Trend,
  Barrier,
  Source,
  MarketShareData,
  TargetSegmentPriority,
} from '../types/research.types';

// ============================================================================
// Section Splitting Logic
// ============================================================================

/**
 * Splits the Gemini response into sections based on headers
 * Handles both ## and ### markdown headers
 */
export function splitIntoSections(response: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Normalize line endings and split into lines
  const lines = response.replace(/\r\n/g, '\n').split('\n');
  
  let currentSection = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // Check for section headers (## or ###)
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/);
    
    if (headerMatch) {
      // Save previous section if it exists
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      
      // Start new section
      currentSection = headerMatch[1].trim().toUpperCase();
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section
      currentContent.push(line);
    }
  }
  
  // Save the last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

/**
 * Extracts bullet points from text content
 */
function extractBulletPoints(text: string): string[] {
  const lines = text.split('\n');
  const bullets: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Match various bullet formats: -, *, •, or numbered lists
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    
    if (bulletMatch) {
      bullets.push(bulletMatch[1].trim());
    }
  }
  
  return bullets;
}

/**
 * Extracts key-value pairs from text (e.g., "TAM: $50B")
 */
function extractKeyValue(text: string, key: string): string {
  const regex = new RegExp(`${key}[:\\s]+([^,\\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : 'N/A';
}

/**
 * Safely parses a maturity level
 */
function parseMaturity(text: string): 'emerging' | 'established' | 'mature' {
  const lower = text.toLowerCase();
  if (lower.includes('emerging')) return 'emerging';
  if (lower.includes('mature')) return 'mature';
  return 'established';
}

/**
 * Safely parses impact/severity level
 */
function parseLevel(text: string): 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase();
  if (lower.includes('high')) return 'high';
  if (lower.includes('low')) return 'low';
  return 'medium';
}

// ============================================================================
// Market Overview Parser
// ============================================================================

export function parseMarketOverview(sectionText: string): MarketOverview {
  try {
    
    return {
      industryDescription: {
        size: extractKeyValue(sectionText, 'size') || extractKeyValue(sectionText, 'market size'),
        maturity: parseMaturity(sectionText),
        keyTrends: extractBulletPoints(sectionText).slice(0, 5) || ['Data not available'],
      },
      marketSize: {
        tam: extractKeyValue(sectionText, 'TAM'),
        sam: extractKeyValue(sectionText, 'SAM'),
        som: extractKeyValue(sectionText, 'SOM'),
      },
      growthRate: {
        cagr: extractKeyValue(sectionText, 'CAGR'),
        yoyGrowth: extractKeyValue(sectionText, 'YoY') || extractKeyValue(sectionText, 'year-over-year'),
      },
      regulatoryFactors: extractBulletPoints(sectionText).filter(item => 
        item.toLowerCase().includes('regulat') || 
        item.toLowerCase().includes('complian') ||
        item.toLowerCase().includes('legal')
      ) || ['No specific regulatory factors identified'],
    };
  } catch (error) {
    console.error('Error parsing market overview:', error);
    return getDefaultMarketOverview();
  }
}

function getDefaultMarketOverview(): MarketOverview {
  return {
    industryDescription: {
      size: 'N/A',
      maturity: 'established',
      keyTrends: ['Data not available'],
    },
    marketSize: {
      tam: 'N/A',
      sam: 'N/A',
      som: 'N/A',
    },
    growthRate: {
      cagr: 'N/A',
      yoyGrowth: 'N/A',
    },
    regulatoryFactors: ['No data available'],
  };
}

// ============================================================================
// Target Audience Parser
// ============================================================================

export function parseTargetAudience(sectionText: string): TargetAudience {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      demographics: {
        age: extractKeyValue(sectionText, 'age'),
        gender: extractKeyValue(sectionText, 'gender'),
        income: extractKeyValue(sectionText, 'income'),
        education: extractKeyValue(sectionText, 'education'),
        occupation: bullets.filter(item => 
          item.toLowerCase().includes('occupation') || 
          item.toLowerCase().includes('job') ||
          item.toLowerCase().includes('profession')
        ).slice(0, 3) || ['N/A'],
      },
      psychographics: {
        interests: bullets.filter(item => item.toLowerCase().includes('interest')).slice(0, 5) || ['N/A'],
        values: bullets.filter(item => item.toLowerCase().includes('value')).slice(0, 5) || ['N/A'],
        motivations: bullets.filter(item => item.toLowerCase().includes('motivat')).slice(0, 5) || ['N/A'],
        lifestyle: extractKeyValue(sectionText, 'lifestyle') || 'N/A',
      },
      behavioralData: {
        purchaseHabits: bullets.filter(item => 
          item.toLowerCase().includes('purchase') || 
          item.toLowerCase().includes('buying')
        ).slice(0, 3) || ['N/A'],
        usageFrequency: extractKeyValue(sectionText, 'frequency') || extractKeyValue(sectionText, 'usage'),
        brandLoyalty: extractKeyValue(sectionText, 'loyalty') || 'N/A',
      },
      painPoints: bullets.filter(item => 
        item.toLowerCase().includes('pain') || 
        item.toLowerCase().includes('challenge') ||
        item.toLowerCase().includes('problem')
      ) || ['No pain points identified'],
      customerSegments: parseCustomerSegments(sectionText),
    };
  } catch (error) {
    console.error('Error parsing target audience:', error);
    return getDefaultTargetAudience();
  }
}

function parseCustomerSegments(text: string): CustomerSegment[] {
  const segments: CustomerSegment[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes('segment')) {
      const name = line.replace(/^[-*•]\s*/, '').replace(/segment[:\s]*/i, '').trim();
      const description = lines[i + 1]?.trim() || 'No description available';
      const size = extractKeyValue(lines.slice(i, i + 3).join('\n'), 'size');
      
      if (name) {
        segments.push({ name, description, size });
      }
    }
  }
  
  return segments.length > 0 ? segments : [
    { name: 'General Market', description: 'No specific segments identified', size: 'N/A' }
  ];
}

function getDefaultTargetAudience(): TargetAudience {
  return {
    demographics: {
      age: 'N/A',
      gender: 'N/A',
      income: 'N/A',
      education: 'N/A',
      occupation: ['N/A'],
    },
    psychographics: {
      interests: ['N/A'],
      values: ['N/A'],
      motivations: ['N/A'],
      lifestyle: 'N/A',
    },
    behavioralData: {
      purchaseHabits: ['N/A'],
      usageFrequency: 'N/A',
      brandLoyalty: 'N/A',
    },
    painPoints: ['No data available'],
    customerSegments: [{ name: 'General Market', description: 'No data available', size: 'N/A' }],
  };
}

// ============================================================================
// Competitive Analysis Parser
// ============================================================================

export function parseCompetitiveAnalysis(sectionText: string): CompetitiveAnalysis {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      directCompetitors: parseCompetitors(sectionText, 'direct'),
      indirectCompetitors: parseCompetitors(sectionText, 'indirect'),
      marketShare: parseMarketShare(sectionText),
      swotAnalysis: parseSWOT(sectionText),
      comparison: {
        pricing: bullets.filter(item => item.toLowerCase().includes('pric')).slice(0, 3) || ['N/A'],
        features: bullets.filter(item => item.toLowerCase().includes('feature')).slice(0, 5) || ['N/A'],
        marketing: bullets.filter(item => item.toLowerCase().includes('market')).slice(0, 3) || ['N/A'],
      },
    };
  } catch (error) {
    console.error('Error parsing competitive analysis:', error);
    return getDefaultCompetitiveAnalysis();
  }
}

function parseCompetitors(text: string, type: 'direct' | 'indirect'): Competitor[] {
  const competitors: Competitor[] = [];
  const lines = text.split('\n');
  let inSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    if (line.includes(type) && line.includes('competitor')) {
      inSection = true;
      continue;
    }
    
    if (inSection && (line.includes('indirect') || line.includes('market share') || line.includes('swot'))) {
      break;
    }
    
    if (inSection) {
      const match = lines[i].trim().match(/^[-*•]\s*(.+)$/);
      if (match) {
        const parts = match[1].split(/[-:]/);
        competitors.push({
          name: parts[0].trim(),
          description: parts[1]?.trim() || 'No description available',
          marketPosition: parts[2]?.trim() || 'N/A',
        });
      }
    }
  }
  
  return competitors.length > 0 ? competitors : [
    { name: 'No competitors identified', description: 'N/A', marketPosition: 'N/A' }
  ];
}

function parseMarketShare(text: string): MarketShareData[] {
  const shares: MarketShareData[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const match = line.match(/([^:]+):\s*(\d+%)/);
    if (match) {
      shares.push({
        competitor: match[1].trim(),
        share: match[2].trim(),
      });
    }
  }
  
  return shares.length > 0 ? shares : [
    { competitor: 'Data not available', share: 'N/A' }
  ];
}

function parseSWOT(text: string): CompetitiveAnalysis['swotAnalysis'] {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[],
  };
  
  const lines = text.split('\n');
  let currentCategory: keyof typeof swot | null = null;
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    
    if (lower.includes('strength')) currentCategory = 'strengths';
    else if (lower.includes('weakness')) currentCategory = 'weaknesses';
    else if (lower.includes('opportunit')) currentCategory = 'opportunities';
    else if (lower.includes('threat')) currentCategory = 'threats';
    
    if (currentCategory) {
      const bulletMatch = line.trim().match(/^[-*•]\s+(.+)$/);
      if (bulletMatch) {
        swot[currentCategory].push(bulletMatch[1].trim());
      }
    }
  }
  
  // Ensure each category has at least one item
  Object.keys(swot).forEach(key => {
    if (swot[key as keyof typeof swot].length === 0) {
      swot[key as keyof typeof swot].push('No data available');
    }
  });
  
  return swot;
}

function getDefaultCompetitiveAnalysis(): CompetitiveAnalysis {
  return {
    directCompetitors: [{ name: 'N/A', description: 'N/A', marketPosition: 'N/A' }],
    indirectCompetitors: [{ name: 'N/A', description: 'N/A', marketPosition: 'N/A' }],
    marketShare: [{ competitor: 'N/A', share: 'N/A' }],
    swotAnalysis: {
      strengths: ['No data available'],
      weaknesses: ['No data available'],
      opportunities: ['No data available'],
      threats: ['No data available'],
    },
    comparison: {
      pricing: ['N/A'],
      features: ['N/A'],
      marketing: ['N/A'],
    },
  };
}

// ============================================================================
// Market Trends Parser
// ============================================================================

export function parseMarketTrends(sectionText: string): MarketTrends {
  try {
    return {
      emergingTrends: parseTrends(sectionText),
      unmetNeeds: extractBulletPoints(sectionText).filter(item =>
        item.toLowerCase().includes('unmet') ||
        item.toLowerCase().includes('gap') ||
        item.toLowerCase().includes('need')
      ) || ['No unmet needs identified'],
      growthDrivers: {
        technological: extractBulletPoints(sectionText).filter(item =>
          item.toLowerCase().includes('tech') ||
          item.toLowerCase().includes('ai') ||
          item.toLowerCase().includes('automation')
        ) || ['N/A'],
        social: extractBulletPoints(sectionText).filter(item =>
          item.toLowerCase().includes('social') ||
          item.toLowerCase().includes('remote') ||
          item.toLowerCase().includes('collaboration')
        ) || ['N/A'],
        economic: extractBulletPoints(sectionText).filter(item =>
          item.toLowerCase().includes('economic') ||
          item.toLowerCase().includes('cost') ||
          item.toLowerCase().includes('efficiency')
        ) || ['N/A'],
      },
      barriersToEntry: parseBarriers(sectionText),
    };
  } catch (error) {
    console.error('Error parsing market trends:', error);
    return getDefaultMarketTrends();
  }
}

function parseTrends(text: string): Trend[] {
  const trends: Trend[] = [];
  const bullets = extractBulletPoints(text);
  
  for (const bullet of bullets) {
    if (bullet.toLowerCase().includes('trend')) {
      const parts = bullet.split(/[-:]/);
      trends.push({
        name: parts[0].trim(),
        description: parts[1]?.trim() || bullet,
        impact: parseLevel(bullet),
      });
    }
  }
  
  return trends.length > 0 ? trends : [
    { name: 'No trends identified', description: 'N/A', impact: 'medium' }
  ];
}

function parseBarriers(text: string): Barrier[] {
  const barriers: Barrier[] = [];
  const bullets = extractBulletPoints(text);
  
  for (const bullet of bullets) {
    if (bullet.toLowerCase().includes('barrier') || bullet.toLowerCase().includes('entry')) {
      const parts = bullet.split(/[-:]/);
      barriers.push({
        type: parts[0].trim(),
        description: parts[1]?.trim() || bullet,
        severity: parseLevel(bullet),
      });
    }
  }
  
  return barriers.length > 0 ? barriers : [
    { type: 'No barriers identified', description: 'N/A', severity: 'low' }
  ];
}

function getDefaultMarketTrends(): MarketTrends {
  return {
    emergingTrends: [{ name: 'N/A', description: 'N/A', impact: 'medium' }],
    unmetNeeds: ['No data available'],
    growthDrivers: {
      technological: ['N/A'],
      social: ['N/A'],
      economic: ['N/A'],
    },
    barriersToEntry: [{ type: 'N/A', description: 'N/A', severity: 'low' }],
  };
}

// ============================================================================
// Demand Analysis Parser
// ============================================================================

export function parseDemandAnalysis(sectionText: string): DemandAnalysis {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      historicalDemand: {
        trends: bullets.filter(item =>
          item.toLowerCase().includes('trend') ||
          item.toLowerCase().includes('historical') ||
          item.toLowerCase().includes('growth')
        ).slice(0, 5) || ['No historical data available'],
        seasonalEffects: bullets.filter(item =>
          item.toLowerCase().includes('seasonal') ||
          item.toLowerCase().includes('cyclical')
        ) || ['No seasonal effects identified'],
      },
      adoptionCurve: {
        currentStage: extractKeyValue(sectionText, 'stage') || extractKeyValue(sectionText, 'adoption'),
        description: bullets.find(item => item.toLowerCase().includes('adoption'))?.trim() || 'N/A',
      },
      marketReadiness: {
        score: extractKeyValue(sectionText, 'readiness') || extractKeyValue(sectionText, 'score'),
        factors: bullets.filter(item =>
          item.toLowerCase().includes('ready') ||
          item.toLowerCase().includes('factor')
        ).slice(0, 5) || ['N/A'],
      },
      elasticity: {
        priceElasticity: extractKeyValue(sectionText, 'price elasticity') || 'N/A',
        featureElasticity: extractKeyValue(sectionText, 'feature elasticity') || 'N/A',
      },
    };
  } catch (error) {
    console.error('Error parsing demand analysis:', error);
    return getDefaultDemandAnalysis();
  }
}

function getDefaultDemandAnalysis(): DemandAnalysis {
  return {
    historicalDemand: {
      trends: ['No data available'],
      seasonalEffects: ['No data available'],
    },
    adoptionCurve: {
      currentStage: 'N/A',
      description: 'N/A',
    },
    marketReadiness: {
      score: 'N/A',
      factors: ['N/A'],
    },
    elasticity: {
      priceElasticity: 'N/A',
      featureElasticity: 'N/A',
    },
  };
}

// ============================================================================
// Research Sources Parser
// ============================================================================

export function parseResearchSources(sectionText: string): ResearchSources {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      primaryResearch: {
        methods: bullets.filter(item =>
          item.toLowerCase().includes('survey') ||
          item.toLowerCase().includes('interview') ||
          item.toLowerCase().includes('focus group') ||
          item.toLowerCase().includes('primary')
        ) || ['No primary research methods specified'],
        description: bullets.find(item => item.toLowerCase().includes('primary'))?.trim() || 'N/A',
      },
      secondaryResearch: {
        sources: parseSources(sectionText),
      },
    };
  } catch (error) {
    console.error('Error parsing research sources:', error);
    return getDefaultResearchSources();
  }
}

function parseSources(text: string): Source[] {
  const sources: Source[] = [];
  const bullets = extractBulletPoints(text);
  
  for (const bullet of bullets) {
    if (bullet.toLowerCase().includes('report') ||
        bullet.toLowerCase().includes('database') ||
        bullet.toLowerCase().includes('study') ||
        bullet.toLowerCase().includes('secondary')) {
      const parts = bullet.split(/[-:]/);
      sources.push({
        type: parts[0].trim(),
        name: parts[1]?.trim() || bullet,
        description: parts[2]?.trim(),
      });
    }
  }
  
  return sources.length > 0 ? sources : [
    { type: 'General', name: 'No specific sources identified', description: 'N/A' }
  ];
}

function getDefaultResearchSources(): ResearchSources {
  return {
    primaryResearch: {
      methods: ['No data available'],
      description: 'N/A',
    },
    secondaryResearch: {
      sources: [{ type: 'N/A', name: 'N/A', description: 'N/A' }],
    },
  };
}

// ============================================================================
// Insights Parser
// ============================================================================

export function parseInsights(sectionText: string): Insights {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      interpretation: bullets.filter(item =>
        item.toLowerCase().includes('interpret') ||
        item.toLowerCase().includes('means') ||
        item.toLowerCase().includes('indicates')
      ).slice(0, 5) || ['No interpretation available'],
      targetSegments: parseTargetSegments(sectionText),
      positioning: {
        strategy: extractKeyValue(sectionText, 'strategy') || extractKeyValue(sectionText, 'positioning'),
        differentiators: bullets.filter(item =>
          item.toLowerCase().includes('different') ||
          item.toLowerCase().includes('unique') ||
          item.toLowerCase().includes('advantage')
        ).slice(0, 5) || ['N/A'],
      },
      risks: bullets.filter(item =>
        item.toLowerCase().includes('risk') ||
        item.toLowerCase().includes('challenge') ||
        item.toLowerCase().includes('gap')
      ) || ['No risks identified'],
      opportunities: {
        shortTerm: bullets.filter(item =>
          item.toLowerCase().includes('short') ||
          item.toLowerCase().includes('immediate') ||
          item.toLowerCase().includes('quick')
        ).slice(0, 3) || ['N/A'],
        longTerm: bullets.filter(item =>
          item.toLowerCase().includes('long') ||
          item.toLowerCase().includes('future') ||
          item.toLowerCase().includes('strategic')
        ).slice(0, 3) || ['N/A'],
      },
    };
  } catch (error) {
    console.error('Error parsing insights:', error);
    return getDefaultInsights();
  }
}

function parseTargetSegments(text: string): TargetSegmentPriority[] {
  const segments: TargetSegmentPriority[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('priority') || line.includes('target segment')) {
      const match = lines[i].match(/(\d+)/);
      const priority = match ? parseInt(match[1]) : 1;
      const segment = lines[i].replace(/^[-*•]\s*/, '').replace(/priority[:\s]*\d+/i, '').trim();
      const rationale = lines[i + 1]?.trim() || 'No rationale provided';
      
      if (segment) {
        segments.push({ segment, priority, rationale });
      }
    }
  }
  
  return segments.length > 0 ? segments : [
    { segment: 'General Market', priority: 1, rationale: 'No specific segments identified' }
  ];
}

function getDefaultInsights(): Insights {
  return {
    interpretation: ['No data available'],
    targetSegments: [{ segment: 'N/A', priority: 1, rationale: 'N/A' }],
    positioning: {
      strategy: 'N/A',
      differentiators: ['N/A'],
    },
    risks: ['No data available'],
    opportunities: {
      shortTerm: ['N/A'],
      longTerm: ['N/A'],
    },
  };
}

// ============================================================================
// Main Parser Function
// ============================================================================

/**
 * Main function to parse complete Gemini response into ResearchData
 * Handles malformed responses gracefully with default values
 */
export function parseGeminiResponse(response: string): ResearchData {
  try {
    // Split response into sections
    const sections = splitIntoSections(response);
    
    // Parse each section with fallback to defaults
    return {
      marketOverview: parseMarketOverview(
        sections['MARKET OVERVIEW'] || sections['1. MARKET OVERVIEW'] || ''
      ),
      targetAudience: parseTargetAudience(
        sections['TARGET AUDIENCE'] || sections['2. TARGET AUDIENCE'] || ''
      ),
      competitiveAnalysis: parseCompetitiveAnalysis(
        sections['COMPETITIVE ANALYSIS'] || sections['3. COMPETITIVE ANALYSIS'] || ''
      ),
      marketTrends: parseMarketTrends(
        sections['MARKET TRENDS'] || sections['4. MARKET TRENDS'] || ''
      ),
      demandAnalysis: parseDemandAnalysis(
        sections['DEMAND ANALYSIS'] || sections['5. DEMAND ANALYSIS'] || ''
      ),
      researchSources: parseResearchSources(
        sections['RESEARCH SOURCES'] || sections['6. RESEARCH SOURCES'] || ''
      ),
      insights: parseInsights(
        sections['INSIGHTS AND RECOMMENDATIONS'] || 
        sections['7. INSIGHTS AND RECOMMENDATIONS'] ||
        sections['INSIGHTS'] || 
        ''
      ),
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    // Return complete default data structure if parsing fails
    return {
      marketOverview: getDefaultMarketOverview(),
      targetAudience: getDefaultTargetAudience(),
      competitiveAnalysis: getDefaultCompetitiveAnalysis(),
      marketTrends: getDefaultMarketTrends(),
      demandAnalysis: getDefaultDemandAnalysis(),
      researchSources: getDefaultResearchSources(),
      insights: getDefaultInsights(),
    };
  }
}
