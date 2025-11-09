# Market Research Tool

A comprehensive market research tool for coding project management solutions, powered by Google's Gemini AI.

## Features

- **AI-Powered Research**: Generates detailed market research reports using Gemini AI
- **Seven Research Categories**: 
  - Market Overview (TAM, SAM, SOM, growth rates)
  - Target Audience (demographics, psychographics, pain points)
  - Competitive Analysis (SWOT, market share, competitor comparison)
  - Market Trends (emerging trends, growth drivers, barriers)
  - Demand Analysis (adoption curve, market readiness, elasticity)
  - Research Sources (primary and secondary research)
  - Actionable Insights (positioning strategy, opportunities, risks)
- **Clean White-Themed UI**: Modern, accessible interface with responsive design
- **Error Handling**: Comprehensive error handling with retry logic and user-friendly messages
- **Loading States**: Clear feedback during research generation

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Key**:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   - Get your API key from: https://makersuite.google.com/app/apikey

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Architecture

### Main Components

- **App.tsx**: Root component with state management and API integration
- **ErrorBoundary**: Catches and handles React errors gracefully
- **ResearchGenerator**: UI for triggering research generation
- **ResearchDisplay**: Container for displaying all research categories
- **Category Cards**: Individual components for each research section

### Services

- **geminiService.ts**: Handles Gemini API communication with timeout and retry logic
- **responseParser.ts**: Parses AI responses into structured TypeScript objects

### Data Flow

1. User clicks "Generate Market Research"
2. App component calls `generateMarketResearch()` from geminiService
3. Service makes API call to Gemini with structured prompt
4. Response is parsed into typed ResearchData structure
5. Data flows to ResearchDisplay and individual category cards
6. UI updates with research results

## Error Handling

The application includes multiple layers of error handling:

- **API Errors**: Network failures, timeouts, invalid API keys
- **Parsing Errors**: Malformed responses with fallback to default values
- **UI Errors**: React error boundary catches rendering errors
- **Retry Logic**: Automatic retry with exponential backoff (max 2 retries)
- **Timeout**: 25-second timeout for API calls

## Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (required)

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

MIT
