from django.shortcuts import redirect
from django.contrib.auth import login
from django.conf import settings
from allauth.socialaccount.models import SocialAccount
from .models import UserProfile

def oauth_callback_redirect(request):
    """
    Custom OAuth callback handler that redirects to frontend with session
    """
    if request.user.is_authenticated:
        # User is logged in via OAuth
        # Create or get user profile
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Redirect to frontend dashboard or onboarding
        if profile.onboarding_completed:
            return redirect('http://localhost:3000/workspace/dashboard')
        else:
            return redirect('http://localhost:3000/onboarding')
    else:
        # OAuth failed, redirect to login
        return redirect('http://localhost:3000/login?error=oauth_failed')

