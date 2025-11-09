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
