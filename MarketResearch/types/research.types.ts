// Market Research Tool - TypeScript Type Definitions

// ============================================================================
// Market Overview Types
// ============================================================================

export interface MarketOverview {
  industryDescription: {
    size: string;
    maturity: 'emerging' | 'established' | 'mature';
    keyTrends: string[];
  };
  marketSize: {
    tam: string;
    sam: string;
    som: string;
  };
  growthRate: {
    cagr: string;
    yoyGrowth: string;
  };
  regulatoryFactors: string[];
}

// ============================================================================
// Target Audience Types
// ============================================================================

export interface CustomerSegment {
  name: string;
  description: string;
  size: string;
}

export interface TargetAudience {
  demographics: {
    age: string;
    gender: string;
    income: string;
    education: string;
    occupation: string[];
  };
  psychographics: {
    interests: string[];
    values: string[];
    motivations: string[];
    lifestyle: string;
  };
  behavioralData: {
    purchaseHabits: string[];
    usageFrequency: string;
    brandLoyalty: string;
  };
  painPoints: string[];
  customerSegments: CustomerSegment[];
}

// ============================================================================
// Competitive Analysis Types
// ============================================================================

export interface Competitor {
  name: string;
  description: string;
  marketPosition: string;
}

export interface MarketShareData {
  competitor: string;
  share: string;
}

export interface ComparisonData {
  pricing: string[];
  features: string[];
  marketing: string[];
}

export interface CompetitiveAnalysis {
  directCompetitors: Competitor[];
  indirectCompetitors: Competitor[];
  marketShare: MarketShareData[];
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  comparison: ComparisonData;
}

// ============================================================================
// Market Trends Types
// ============================================================================

export interface Trend {
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Barrier {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface MarketTrends {
  emergingTrends: Trend[];
  unmetNeeds: string[];
  growthDrivers: {
    technological: string[];
    social: string[];
    economic: string[];
  };
  barriersToEntry: Barrier[];
}

// ============================================================================
// Demand Analysis Types
// ============================================================================

export interface DemandAnalysis {
  historicalDemand: {
    trends: string[];
    seasonalEffects: string[];
  };
  adoptionCurve: {
    currentStage: string;
    description: string;
  };
  marketReadiness: {
    score: string;
    factors: string[];
  };
  elasticity: {
    priceElasticity: string;
    featureElasticity: string;
  };
}

// ============================================================================
// Research Sources Types
// ============================================================================

export interface Source {
  type: string;
  name: string;
  description?: string;
}

export interface ResearchSources {
  primaryResearch: {
    methods: string[];
    description: string;
  };
  secondaryResearch: {
    sources: Source[];
  };
}

// ============================================================================
// Insights and Recommendations Types
// ============================================================================

export interface TargetSegmentPriority {
  segment: string;
  priority: number;
  rationale: string;
}

export interface PositioningStrategy {
  strategy: string;
  differentiators: string[];
}

export interface Insights {
  interpretation: string[];
  targetSegments: TargetSegmentPriority[];
  positioning: PositioningStrategy;
  risks: string[];
  opportunities: {
    shortTerm: string[];
    longTerm: string[];
  };
}

// ============================================================================
// Complete Research Data Type
// ============================================================================

export interface ResearchData {
  marketOverview: MarketOverview;
  targetAudience: TargetAudience;
  competitiveAnalysis: CompetitiveAnalysis;
  marketTrends: MarketTrends;
  demandAnalysis: DemandAnalysis;
  researchSources: ResearchSources;
  insights: Insights;
}

// ============================================================================
// Error State Types
// ============================================================================

export type ErrorType = 'api' | 'parsing' | 'ui' | 'unknown';

export interface ErrorState {
  type: ErrorType;
  message: string;
  retryable: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorState;
}

export interface GeminiApiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

// ============================================================================
// Loading State Types
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// ============================================================================
// Application State Types
// ============================================================================

export interface AppState {
  researchData: ResearchData | null;
  loading: LoadingState;
  error: ErrorState | null;
}
