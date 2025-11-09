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
]

