from django.contrib import admin
from .models import (
    UserProfile, PasswordResetToken,
    ProductStrategy, Idea, MarketSizing, ScenarioPlan,
    Roadmap, BacklogItem, PRDDocument, Sprint,
    GTMStrategy, ContentAsset, LaunchChecklist,
    Metric, AIInsight, Experiment,
    AIAgent, Workflow,
    CustomerFeedback, CompetitorIntel, UserPersona, ResearchDocument
)

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(PasswordResetToken)

# Strategy & Ideation
admin.site.register(ProductStrategy)
admin.site.register(Idea)
admin.site.register(MarketSizing)
admin.site.register(ScenarioPlan)

# Requirements & Development
admin.site.register(Roadmap)
admin.site.register(BacklogItem)
admin.site.register(PRDDocument)
admin.site.register(Sprint)

# Go-to-Market
admin.site.register(GTMStrategy)
admin.site.register(ContentAsset)
admin.site.register(LaunchChecklist)

# Analytics & Insights
admin.site.register(Metric)
admin.site.register(AIInsight)
admin.site.register(Experiment)

# Automation
admin.site.register(AIAgent)
admin.site.register(Workflow)

# Research & Intelligence
admin.site.register(CustomerFeedback)
admin.site.register(CompetitorIntel)
admin.site.register(UserPersona)
admin.site.register(ResearchDocument)
