import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ResearchData, ErrorState } from '../types/MarketResearch.types';

// ============================================================================
// Configuration Constants
// ============================================================================

const API_TIMEOUT = 25000; // 25 seconds
const MAX_RETRIES = 2;
const INITIAL_BACKOFF_MS = 1000;

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Creates a standardized error state object
 */
function createErrorState(
  type: ErrorState['type'],
  message: string,
  retryable: boolean
): ErrorState {
  return { type, message, retryable };
}

/**
 * Handles and categorizes errors from API calls
 */
function handleError(error: unknown): ErrorState {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
      return createErrorState(
        'api',
        'Request timed out. Please try again.',
        true
      );
    }

    // API key errors
    if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
      return createErrorState(
        'api',
        'Invalid API configuration. Please check your settings.',
        false
      );
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return createErrorState(
        'api',
        'Unable to connect to the research service. Please check your connection.',
        true
      );
    }

    // Rate limiting
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return createErrorState(
        'api',
        'Too many requests. Please wait a moment and try again.',
        true
      );
    }

    // Parsing errors
    if (errorMessage.includes('parse') || errorMessage.includes('invalid response')) {
      return createErrorState(
        'parsing',
        'Received incomplete data. Retrying...',
        true
      );
    }

    // Generic error with original message
    return createErrorState(
      'unknown',
      error.message || 'An unexpected error occurred. Please try again.',
      true
    );
  }

  // Unknown error type
  return createErrorState(
    'unknown',
    'An unexpected error occurred. Please try again.',
    true
  );
}

/**
 * Delays execution for exponential backoff
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Gemini API Client
// ============================================================================

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string | null = null;

  /**
   * Initializes the Gemini API client with the provided API key
   */
  initialize(apiKey: string): void {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Checks if the service is initialized
   */
  private ensureInitialized(): void {
    if (!this.genAI || !this.apiKey) {
      throw new Error('Gemini service not initialized. Call initialize() first.');
    }
  }

  /**
   * Creates the research prompt for the Gemini model
   */
  private createPrompt(topic: string): string {
    return `You are a market research expert. 
Generate a comprehensive market research report for: ${topic}

Structure your response with the following sections:

1. MARKET OVERVIEW
   - Industry description (size, maturity, key trends)
   - Market size (TAM, SAM, SOM)
   - Growth rate (CAGR, YoY)
   - Regulatory factors

2. TARGET AUDIENCE
   - Demographics
   - Psychographics
   - Behavioral data
   - Pain points
   - Customer segments

3. COMPETITIVE ANALYSIS
   - Direct competitors (list each with name, description, and market position)
   - Indirect competitors (list each with name, description, and market position)
   - Market share (format as "Company Name: X%")
   - SWOT analysis (provide at least 3-5 items for each: Strengths, Weaknesses, Opportunities, Threats)
   - Pricing comparison (specific pricing strategies and models)
   - Features comparison (key features that differentiate competitors)
   - Marketing comparison (marketing strategies and approaches)
   
   IMPORTANT: Format competitors clearly with names, descriptions, and positions. 
   For SWOT analysis, provide detailed bullet points (not just headers).
   For comparisons, provide specific, actionable insights.

4. MARKET TRENDS
   - Emerging trends
   - Unmet needs
   - Growth drivers
   - Barriers to entry

5. DEMAND ANALYSIS
   - Historical demand
   - Adoption curve
   - Market readiness
   - Elasticity

6. RESEARCH SOURCES
   - Primary research methods
   - Secondary research sources

7. INSIGHTS AND RECOMMENDATIONS
   - Data interpretation
   - Target segments priority
   - Positioning strategy
   - Risks and gaps
   - Short-term and long-term opportunities

Provide specific, actionable data relevant to this industry and market.`;
  }

  /**
   * Makes a single API call to Gemini with timeout handling
   */
  private async makeApiCall(_signal: AbortSignal, topic: string): Promise<string> {
    this.ensureInitialized();

    try {
      const model = this.genAI!.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });

      const prompt = this.createPrompt(topic);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Invalid response: Empty response from API');
      }

      return text;
    } catch (error: any) {
      // Provide more specific error messages for 404 errors
      if (error?.message?.includes('404') || error?.status === 404) {
        throw new Error(
          'Model gemini-2.5-flash not found. This may be due to: ' +
          '1) The model not being available in your region, ' +
          '2) Your API key not having access to this model, or ' +
          '3) The model name may need to be updated. ' +
          'Please check your Google AI API key permissions and available models.'
        );
      }
      throw error;
    }
  }

  /**
   * Generates market research with timeout and retry logic
   */
  async generateMarketResearch(topic: string): Promise<ResearchData> {
    this.ensureInitialized();

    let lastError: Error | null = null;

    // Retry loop with exponential backoff
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        try {
          // Make API call
          const responseText = await this.makeApiCall(controller.signal, topic);
          clearTimeout(timeoutId);

          // Parse response
          const parsedData = await this.parseResponse(responseText);
          
          return parsedData;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // If this is the last attempt, throw the error
        if (attempt === MAX_RETRIES) {
          throw lastError;
        }

        // Check if error is retryable
        const errorState = handleError(lastError);
        if (!errorState.retryable) {
          throw lastError;
        }

        // Exponential backoff: wait before retrying
        const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        await delay(backoffTime);
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError || new Error('Failed to generate research after retries');
  }

  /**
   * Parses the Gemini API response text into structured ResearchData
   */
  private async parseResponse(responseText: string): Promise<ResearchData> {
    // Import the parser dynamically to avoid circular dependencies
    const { parseGeminiResponse } = await import('../utils/responseParser');
    return parseGeminiResponse(responseText);
  }
}

// ============================================================================
// Singleton Instance Export
// ============================================================================

export const geminiService = new GeminiService();

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Initializes the Gemini service with an API key
 */
export function initializeGeminiService(apiKey: string): void {
  geminiService.initialize(apiKey);
}

/**
 * Generates market research data with error handling
 * Returns either the research data or an error state
 */
export async function generateMarketResearch(topic: string): Promise<{
  data?: ResearchData;
  error?: ErrorState;
}> {
  try {
    const data = await geminiService.generateMarketResearch(topic);
    return { data };
  } catch (error) {
    const errorState = handleError(error);
    return { error: errorState };
  }
}

// Export error handling utility for use in other modules
export { handleError };

