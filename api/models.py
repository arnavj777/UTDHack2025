from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import secrets
import json

class UserProfile(models.Model):
    """Extended user profile to store preferences and settings"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # User preferences stored as JSON
    preferences = models.JSONField(default=dict, blank=True)
    
    # Onboarding data
    onboarding_completed = models.BooleanField(default=False)
    onboarding_data = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def get_preference(self, key, default=None):
        """Get a preference value by key"""
        return self.preferences.get(key, default)
    
    def set_preference(self, key, value):
        """Set a preference value"""
        if not self.preferences:
            self.preferences = {}
        self.preferences[key] = value
        self.save()
    
    def update_preferences(self, preferences_dict):
        """Update multiple preferences at once"""
        if not self.preferences:
            self.preferences = {}
        self.preferences.update(preferences_dict)
        self.save()


class PasswordResetToken(models.Model):
    """Model to store password reset tokens"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Password reset token for {self.user.email}"
    
    @classmethod
    def generate_token(cls, user):
        """Generate a new password reset token for a user"""
        # Invalidate all existing tokens for this user
        cls.objects.filter(user=user, used=False).update(used=True)
        
        # Generate a secure random token
        token = secrets.token_urlsafe(48)
        
        # Create new token (expires in 1 hour)
        expires_at = timezone.now() + timedelta(hours=1)
        reset_token = cls.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        return reset_token
    
    @classmethod
    def validate_token(cls, token):
        """Validate a password reset token"""
        try:
            reset_token = cls.objects.get(token=token, used=False)
            
            # Check if token has expired
            if timezone.now() > reset_token.expires_at:
                return None, "Token has expired. Please request a new password reset."
            
            return reset_token, None
        except cls.DoesNotExist:
            return None, "Invalid or expired reset token. Please request a new password reset."
    
    def mark_as_used(self):
        """Mark this token as used"""
        self.used = True
        self.save()


# Strategy & Ideation Models
class ProductStrategy(models.Model):
    """Product Strategy Hub"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_strategies')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class Idea(models.Model):
    """Idea Repository"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ideas')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='new')
    tags = models.JSONField(default=list, blank=True)
    impact_score = models.IntegerField(default=0)
    effort_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class MarketSizing(models.Model):
    """Market Sizing Simulator"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='market_sizings')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    tam = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    sam = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    som = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class ScenarioPlan(models.Model):
    """Scenario Planning"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scenario_plans')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    scenario_type = models.CharField(max_length=50, default='what-if')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


# Requirements & Development Models
class Roadmap(models.Model):
    """Roadmap"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roadmaps')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='active')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class BacklogItem(models.Model):
    """Backlog Management"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='backlog_items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='backlog')
    priority = models.CharField(max_length=50, default='medium')
    story_points = models.IntegerField(default=0)
    acceptance_criteria = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class PRDDocument(models.Model):
    """PRD Builder"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prd_documents')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='draft')
    version = models.IntegerField(default=1)
    sections = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} v{self.version} - {self.user.username}"


class Sprint(models.Model):
    """Sprint Planning"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sprints')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='planned')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    velocity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


# Go-to-Market Models
class GTMStrategy(models.Model):
    """GTM Strategy Board"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gtm_strategies')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='draft')
    launch_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class ContentAsset(models.Model):
    """Content Automation Studio"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='content_assets')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    content_type = models.CharField(max_length=50, default='release-notes')
    content = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} ({self.content_type}) - {self.user.username}"


class LaunchChecklist(models.Model):
    """Launch Readiness Checklist"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='launch_checklists')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='in-progress')
    items = models.JSONField(default=list, blank=True)
    completion_percentage = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


# Analytics & Insights Models
class Metric(models.Model):
    """Metrics Dashboard"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='metrics')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    metric_type = models.CharField(max_length=50, default='kpi')
    value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    unit = models.CharField(max_length=50, blank=True)
    date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class AIInsight(models.Model):
    """AI Insights Narratives"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_insights')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    insight_type = models.CharField(max_length=50, default='analysis')
    narrative = models.TextField(blank=True)
    confidence_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class Experiment(models.Model):
    """Experiment Results Viewer"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiments')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='running')
    experiment_type = models.CharField(max_length=50, default='a-b-test')
    results = models.JSONField(default=dict, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


# Automation Models
class AIAgent(models.Model):
    """AI Agent Control Center"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_agents')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    agent_type = models.CharField(max_length=50, default='automation')
    status = models.CharField(max_length=50, default='active')
    configuration = models.JSONField(default=dict, blank=True)
    autonomy_level = models.IntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class Workflow(models.Model):
    """Workflow Automation Builder"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workflows')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=50, default='active')
    triggers = models.JSONField(default=list, blank=True)
    actions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


# Research & Intelligence Models
class CustomerFeedback(models.Model):
    """Customer Feedback Hub"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_feedbacks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    source = models.CharField(max_length=50, default='support')
    sentiment = models.CharField(max_length=50, default='neutral')
    rating = models.IntegerField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class CompetitorIntel(models.Model):
    """Competitor Intelligence"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='competitor_intels')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    competitor_name = models.CharField(max_length=200, blank=True)
    intel_type = models.CharField(max_length=50, default='feature')
    date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class UserPersona(models.Model):
    """User Persona Manager"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_personas')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    persona_name = models.CharField(max_length=200, blank=True)
    demographics = models.JSONField(default=dict, blank=True)
    behaviors = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class ResearchDocument(models.Model):
    """Research Vault"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='research_documents')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    document_type = models.CharField(max_length=50, default='research')
    content = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
