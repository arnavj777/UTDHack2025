from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from django.contrib.auth import login
from .models import UserProfile

class CustomAccountAdapter(DefaultAccountAdapter):
    """Custom account adapter to handle user creation"""
    
    def save_user(self, request, user, form, commit=True):
        user = super().save_user(request, user, form, commit)
        if commit:
            # Create user profile
            UserProfile.objects.get_or_create(user=user)
        return user
    
    def get_login_redirect_url(self, request):
        """Redirect after login"""
        if request.user.is_authenticated:
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            if profile.onboarding_completed:
                return 'http://localhost:3000/workspace/dashboard'
            else:
                return 'http://localhost:3000/onboarding'
        return 'http://localhost:3000/login'

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Custom social account adapter to handle OAuth login"""
    
    def pre_social_login(self, request, sociallogin):
        """Called before social login"""
        # Auto-create user profile if it doesn't exist
        if sociallogin.is_existing:
            user = sociallogin.user
            UserProfile.objects.get_or_create(user=user)
        else:
            # For new users, ensure profile will be created
            pass
    
    def populate_user(self, request, sociallogin, data):
        """Populate user data from social account"""
        user = super().populate_user(request, sociallogin, data)
        
        # Extract name from social account
        if sociallogin.account.provider == 'google':
            user.first_name = data.get('given_name', '')
            user.last_name = data.get('family_name', '')
        elif sociallogin.account.provider == 'github':
            name = data.get('name', '')
            if name:
                name_parts = name.split(' ', 1)
                user.first_name = name_parts[0] if name_parts else ''
                user.last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        return user
    
    def save_user(self, request, sociallogin, form=None):
        """Save user and create profile after social login"""
        user = super().save_user(request, sociallogin, form)
        # Ensure user profile is created
        profile, created = UserProfile.objects.get_or_create(user=user)
        # Save user to ensure it's persisted
        user.save()
        return user
    
    def get_login_redirect_url(self, request):
        """Redirect after OAuth login"""
        if request.user.is_authenticated:
            # Redirect to OAuth callback page which will check auth and redirect appropriately
            return 'http://localhost:3000/oauth/callback'
        return 'http://localhost:3000/login?error=oauth_failed'
    
    def get_connect_redirect_url(self, request, socialaccount):
        """Redirect after connecting social account"""
        return 'http://localhost:3000/workspace/dashboard'

