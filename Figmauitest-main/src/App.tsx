import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { ProductStrategyHub } from './components/ProductStrategyHub';
import { IdeaRepository } from './components/IdeaRepository';
import { MarketSizingSimulator } from './components/MarketSizingSimulator';
import { ScenarioPlanning } from './components/ScenarioPlanning';
import { Roadmap } from './components/Roadmap';
import { BacklogManagement } from './components/BacklogManagement';
import { PRDBuilder } from './components/PRDBuilder';
import { SprintPlanning } from './components/SprintPlanning';
import { CustomerFeedbackHub } from './components/CustomerFeedbackHub';
import { CompetitorIntelligence } from './components/CompetitorIntelligence';
import { PersonaManager } from './components/PersonaManager';
import { ResearchVault } from './components/ResearchVault';
import { WireframeGenerator } from './components/WireframeGenerator';
import { GTMStrategyBoard } from './components/GTMStrategyBoard';
import { ContentAutomationStudio } from './components/ContentAutomationStudio';
import { LaunchReadinessChecklist } from './components/LaunchReadinessChecklist';
import { MetricsDashboard } from './components/MetricsDashboard';
import { AIInsightsNarratives } from './components/AIInsightsNarratives';
import { ExperimentResultsViewer } from './components/ExperimentResultsViewer';
import { AIAgentControlCenter } from './components/AIAgentControlCenter';
import { WorkflowAutomationBuilder } from './components/WorkflowAutomationBuilder';
import { PMDailyBriefing } from './components/PMDailyBriefing';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        
        {/* Protected workspace routes */}
        <Route path="/workspace" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/workspace/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Strategy & Ideation */}
          <Route path="strategy" element={<ProductStrategyHub />} />
          <Route path="ideas" element={<IdeaRepository />} />
          <Route path="market-sizing" element={<MarketSizingSimulator />} />
          <Route path="scenario-planning" element={<ScenarioPlanning />} />
          
          {/* Requirements & Development */}
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="backlog" element={<BacklogManagement />} />
          <Route path="prd" element={<PRDBuilder />} />
          <Route path="sprint-planning" element={<SprintPlanning />} />
          
          {/* Design & Prototyping */}
          <Route path="wireframe-generator" element={<WireframeGenerator />} />
          
          {/* Go-to-Market */}
          <Route path="gtm-strategy" element={<GTMStrategyBoard />} />
          <Route path="content-automation" element={<ContentAutomationStudio />} />
          <Route path="launch-checklist" element={<LaunchReadinessChecklist />} />
          
          {/* Analytics & Insights */}
          <Route path="metrics" element={<MetricsDashboard />} />
          <Route path="ai-insights" element={<AIInsightsNarratives />} />
          <Route path="experiments" element={<ExperimentResultsViewer />} />
          
          {/* Automation & Agents */}
          <Route path="ai-agent" element={<AIAgentControlCenter />} />
          <Route path="workflow-automation" element={<WorkflowAutomationBuilder />} />
          <Route path="daily-briefing" element={<PMDailyBriefing />} />
          
          {/* Research & Intelligence */}
          <Route path="feedback" element={<CustomerFeedbackHub />} />
          <Route path="competitors" element={<CompetitorIntelligence />} />
          <Route path="personas" element={<PersonaManager />} />
          <Route path="research" element={<ResearchVault />} />
        </Route>
      </Routes>
    </Router>
  );
}
