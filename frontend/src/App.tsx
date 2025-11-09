import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { ProtectedRoute } from './components/ProtectedRoute';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { OAuthCallback } from './components/OAuthCallback';
import { IdeaCreatePage } from './components/IdeaCreatePage';
import { IdeaEditPage } from './components/IdeaEditPage';
import { BacklogItemCreatePage } from './components/BacklogItemCreatePage';
import { BacklogItemEditPage } from './components/BacklogItemEditPage';
import { MarketSizingCreatePage } from './components/MarketSizingCreatePage';
import { MarketSizingEditPage } from './components/MarketSizingEditPage';
import { ScenarioPlanCreatePage } from './components/ScenarioPlanCreatePage';
import { ScenarioPlanEditPage } from './components/ScenarioPlanEditPage';
import { RoadmapCreatePage } from './components/RoadmapCreatePage';
import { RoadmapEditPage } from './components/RoadmapEditPage';
import { PRDDocumentCreatePage } from './components/PRDDocumentCreatePage';
import { PRDDocumentEditPage } from './components/PRDDocumentEditPage';
import { SprintCreatePage } from './components/SprintCreatePage';
import { SprintEditPage } from './components/SprintEditPage';
import { GTMStrategyCreatePage } from './components/GTMStrategyCreatePage';
import { GTMStrategyEditPage } from './components/GTMStrategyEditPage';
import { ContentAssetCreatePage } from './components/ContentAssetCreatePage';
import { ContentAssetEditPage } from './components/ContentAssetEditPage';
import { LaunchChecklistCreatePage } from './components/LaunchChecklistCreatePage';
import { LaunchChecklistEditPage } from './components/LaunchChecklistEditPage';
import { MetricCreatePage } from './components/MetricCreatePage';
import { MetricEditPage } from './components/MetricEditPage';
import { AIInsightCreatePage } from './components/AIInsightCreatePage';
import { AIInsightEditPage } from './components/AIInsightEditPage';
import { ExperimentCreatePage } from './components/ExperimentCreatePage';
import { ExperimentEditPage } from './components/ExperimentEditPage';
import { AIAgentCreatePage } from './components/AIAgentCreatePage';
import { AIAgentEditPage } from './components/AIAgentEditPage';
import { WorkflowCreatePage } from './components/WorkflowCreatePage';
import { WorkflowEditPage } from './components/WorkflowEditPage';
import { CustomerFeedbackCreatePage } from './components/CustomerFeedbackCreatePage';
import { CustomerFeedbackEditPage } from './components/CustomerFeedbackEditPage';
import { CompetitorIntelCreatePage } from './components/CompetitorIntelCreatePage';
import { CompetitorIntelEditPage } from './components/CompetitorIntelEditPage';
import { UserPersonaCreatePage } from './components/UserPersonaCreatePage';
import { UserPersonaEditPage } from './components/UserPersonaEditPage';
import { ResearchDocumentCreatePage } from './components/ResearchDocumentCreatePage';
import { ResearchDocumentEditPage } from './components/ResearchDocumentEditPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
        
        {/* Protected workspace routes */}
        <Route path="/workspace" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/workspace/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Strategy & Ideation */}
          <Route path="strategy" element={<ProductStrategyHub />} />
          <Route path="ideas" element={<IdeaRepository />} />
          <Route path="ideas/create" element={<IdeaCreatePage />} />
          <Route path="ideas/edit/:id" element={<IdeaEditPage />} />
          <Route path="market-sizing" element={<MarketSizingSimulator />} />
          <Route path="market-sizing/create" element={<MarketSizingCreatePage />} />
          <Route path="market-sizing/edit/:id" element={<MarketSizingEditPage />} />
          <Route path="scenario-planning" element={<ScenarioPlanning />} />
          <Route path="scenario-planning/create" element={<ScenarioPlanCreatePage />} />
          <Route path="scenario-planning/edit/:id" element={<ScenarioPlanEditPage />} />
          
          {/* Requirements & Development */}
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="roadmap/create" element={<RoadmapCreatePage />} />
          <Route path="roadmap/edit/:id" element={<RoadmapEditPage />} />
          <Route path="backlog" element={<BacklogManagement />} />
          <Route path="backlog/create" element={<BacklogItemCreatePage />} />
          <Route path="backlog/edit/:id" element={<BacklogItemEditPage />} />
          <Route path="prd" element={<PRDBuilder />} />
          <Route path="prd/create" element={<PRDDocumentCreatePage />} />
          <Route path="prd/edit/:id" element={<PRDDocumentEditPage />} />
          <Route path="sprint-planning" element={<SprintPlanning />} />
          <Route path="sprint-planning/create" element={<SprintCreatePage />} />
          <Route path="sprint-planning/edit/:id" element={<SprintEditPage />} />
          
          {/* Design & Prototyping */}
          <Route path="wireframe-generator" element={<WireframeGenerator />} />
          
          {/* Go-to-Market */}
          <Route path="gtm-strategy" element={<GTMStrategyBoard />} />
          <Route path="gtm-strategy/create" element={<GTMStrategyCreatePage />} />
          <Route path="gtm-strategy/edit/:id" element={<GTMStrategyEditPage />} />
          <Route path="content-automation" element={<ContentAutomationStudio />} />
          <Route path="content-automation/create" element={<ContentAssetCreatePage />} />
          <Route path="content-automation/edit/:id" element={<ContentAssetEditPage />} />
          <Route path="launch-checklist" element={<LaunchReadinessChecklist />} />
          <Route path="launch-checklist/create" element={<LaunchChecklistCreatePage />} />
          <Route path="launch-checklist/edit/:id" element={<LaunchChecklistEditPage />} />
          
          {/* Analytics & Insights */}
          <Route path="metrics" element={<MetricsDashboard />} />
          <Route path="metrics/create" element={<MetricCreatePage />} />
          <Route path="metrics/edit/:id" element={<MetricEditPage />} />
          <Route path="ai-insights" element={<AIInsightsNarratives />} />
          <Route path="ai-insights/create" element={<AIInsightCreatePage />} />
          <Route path="ai-insights/edit/:id" element={<AIInsightEditPage />} />
          <Route path="experiments" element={<ExperimentResultsViewer />} />
          <Route path="experiments/create" element={<ExperimentCreatePage />} />
          <Route path="experiments/edit/:id" element={<ExperimentEditPage />} />
          
          {/* Automation & Agents */}
          <Route path="ai-agent" element={<AIAgentControlCenter />} />
          <Route path="ai-agent/create" element={<AIAgentCreatePage />} />
          <Route path="ai-agent/edit/:id" element={<AIAgentEditPage />} />
          <Route path="workflow-automation" element={<WorkflowAutomationBuilder />} />
          <Route path="workflow-automation/create" element={<WorkflowCreatePage />} />
          <Route path="workflow-automation/edit/:id" element={<WorkflowEditPage />} />
          <Route path="daily-briefing" element={<PMDailyBriefing />} />
          
          {/* Research & Intelligence */}
          <Route path="feedback" element={<CustomerFeedbackHub />} />
          <Route path="feedback/create" element={<CustomerFeedbackCreatePage />} />
          <Route path="feedback/edit/:id" element={<CustomerFeedbackEditPage />} />
          <Route path="competitors" element={<CompetitorIntelligence />} />
          <Route path="competitors/create" element={<CompetitorIntelCreatePage />} />
          <Route path="competitors/edit/:id" element={<CompetitorIntelEditPage />} />
          <Route path="personas" element={<PersonaManager />} />
          <Route path="personas/create" element={<UserPersonaCreatePage />} />
          <Route path="personas/edit/:id" element={<UserPersonaEditPage />} />
          <Route path="research" element={<ResearchVault />} />
          <Route path="research/create" element={<ResearchDocumentCreatePage />} />
          <Route path="research/edit/:id" element={<ResearchDocumentEditPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
