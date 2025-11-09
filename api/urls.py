from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    # Authentication endpoints
    path('auth/signup/', views.signup_view, name='signup'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/user/', views.user_view, name='user'),
    path('auth/preferences/', views.update_preferences_view, name='update_preferences'),
    path('auth/onboarding/', views.complete_onboarding_view, name='complete_onboarding'),
    # Password reset endpoints
    path('auth/forgot-password/', views.forgot_password_view, name='forgot_password'),
    path('auth/validate-reset-token/', views.validate_reset_token_view, name='validate_reset_token'),
    path('auth/reset-password/', views.reset_password_view, name='reset_password'),
    # OAuth endpoints
    path('auth/oauth/login-url/', views.oauth_login_url_view, name='oauth_login_url'),
    path('auth/oauth/callback/', views.oauth_callback_view, name='oauth_callback'),
    # Wireframe generation endpoints
    path('wireframe/generate/', views.generate_wireframe_view, name='generate_wireframe'),
    path('wireframe/refine/', views.refine_wireframe_view, name='refine_wireframe'),
    
    # Strategy & Ideation endpoints
    path('strategy/', views.product_strategy_list_create_view, name='product_strategy_list_create'),
    path('strategy/<int:pk>/', views.product_strategy_detail_view, name='product_strategy_detail'),
    path('ideas/', views.idea_list_create, name='idea_list_create'),
    path('ideas/<int:pk>/', views.idea_detail, name='idea_detail'),
    path('market-sizing/', views.market_sizing_list_create, name='market_sizing_list_create'),
    path('market-sizing/<int:pk>/', views.market_sizing_detail, name='market_sizing_detail'),
    path('scenario-planning/', views.scenario_plan_list_create, name='scenario_plan_list_create'),
    path('scenario-planning/<int:pk>/', views.scenario_plan_detail, name='scenario_plan_detail'),
    
    # Requirements & Development endpoints
    path('roadmap/', views.roadmap_list_create, name='roadmap_list_create'),
    path('roadmap/<int:pk>/', views.roadmap_detail, name='roadmap_detail'),
    path('backlog/', views.backlog_item_list_create, name='backlog_item_list_create'),
    path('backlog/<int:pk>/', views.backlog_item_detail, name='backlog_item_detail'),
    path('prd/', views.prd_document_list_create, name='prd_document_list_create'),
    path('prd/<int:pk>/', views.prd_document_detail, name='prd_document_detail'),
    path('sprint/', views.sprint_list_create, name='sprint_list_create'),
    path('sprint/<int:pk>/', views.sprint_detail, name='sprint_detail'),
    
    # Go-to-Market endpoints
    path('gtm-strategy/', views.gtm_strategy_list_create, name='gtm_strategy_list_create'),
    path('gtm-strategy/<int:pk>/', views.gtm_strategy_detail, name='gtm_strategy_detail'),
    path('content/', views.content_asset_list_create, name='content_asset_list_create'),
    path('content/<int:pk>/', views.content_asset_detail, name='content_asset_detail'),
    path('launch-checklist/', views.launch_checklist_list_create, name='launch_checklist_list_create'),
    path('launch-checklist/<int:pk>/', views.launch_checklist_detail, name='launch_checklist_detail'),
    
    # Analytics & Insights endpoints
    path('metrics/', views.metric_list_create, name='metric_list_create'),
    path('metrics/<int:pk>/', views.metric_detail, name='metric_detail'),
    path('ai-insights/', views.ai_insight_list_create, name='ai_insight_list_create'),
    path('ai-insights/<int:pk>/', views.ai_insight_detail, name='ai_insight_detail'),
    path('experiments/', views.experiment_list_create, name='experiment_list_create'),
    path('experiments/<int:pk>/', views.experiment_detail, name='experiment_detail'),
    
    # Automation endpoints
    path('ai-agent/', views.ai_agent_list_create, name='ai_agent_list_create'),
    path('ai-agent/<int:pk>/', views.ai_agent_detail, name='ai_agent_detail'),
    path('workflow/', views.workflow_list_create, name='workflow_list_create'),
    path('workflow/<int:pk>/', views.workflow_detail, name='workflow_detail'),
    
    # Research & Intelligence endpoints
    path('feedback/', views.customer_feedback_list_create, name='customer_feedback_list_create'),
    path('feedback/<int:pk>/', views.customer_feedback_detail, name='customer_feedback_detail'),
    path('competitors/', views.competitor_intel_list_create, name='competitor_intel_list_create'),
    path('competitors/<int:pk>/', views.competitor_intel_detail, name='competitor_intel_detail'),
    path('personas/', views.user_persona_list_create, name='user_persona_list_create'),
    path('personas/<int:pk>/', views.user_persona_detail, name='user_persona_detail'),
    path('research/', views.research_document_list_create, name='research_document_list_create'),
    path('research/<int:pk>/', views.research_document_detail, name='research_document_detail'),
    
    # AI endpoints
    path('ai/generate-ideas/', views.ai_generate_ideas_view, name='ai_generate_ideas'),
    path('ai/strategy-advice/', views.ai_strategy_advice_view, name='ai_strategy_advice'),
    path('ai/market-analysis/', views.ai_market_analysis_view, name='ai_market_analysis'),
    path('ai/roadmap-prioritization/', views.ai_roadmap_prioritization_view, name='ai_roadmap_prioritization'),
    path('ai/backlog-grooming/', views.ai_backlog_grooming_view, name='ai_backlog_grooming'),
    path('ai/generate-prd/', views.ai_generate_prd_view, name='ai_generate_prd'),
    path('ai/sprint-planning/', views.ai_sprint_planning_view, name='ai_sprint_planning'),
    path('ai/gtm-strategy/', views.ai_gtm_strategy_view, name='ai_gtm_strategy'),
    path('ai/generate-content/', views.ai_generate_content_view, name='ai_generate_content'),
    path('ai/launch-checklist/', views.ai_launch_checklist_view, name='ai_launch_checklist'),
    path('ai/metrics-insights/', views.ai_metrics_insights_view, name='ai_metrics_insights'),
    path('ai/customer-feedback-analysis/', views.ai_customer_feedback_analysis_view, name='ai_customer_feedback_analysis'),
    path('ai/competitor-analysis/', views.ai_competitor_analysis_view, name='ai_competitor_analysis'),
    path('ai/persona-insights/', views.ai_persona_insights_view, name='ai_persona_insights'),
    path('ai/research-insights/', views.ai_research_insights_view, name='ai_research_insights'),
    path('ai/assistant/', views.ai_assistant_view, name='ai_assistant'),
]

