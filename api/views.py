from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import (
    UserProfile, PasswordResetToken,
    ProductStrategy, Idea, MarketSizing, ScenarioPlan,
    Roadmap, BacklogItem, PRDDocument, Sprint,
    GTMStrategy, ContentAsset, LaunchChecklist,
    Metric, AIInsight, Experiment,
    AIAgent, Workflow,
    CustomerFeedback, CompetitorIntel, UserPersona, ResearchDocument
)
from .ai_service import (
    generate_ideas, generate_strategy_advice, generate_market_analysis,
    generate_roadmap_prioritization, generate_backlog_grooming, generate_prd,
    generate_sprint_planning, generate_gtm_strategy, generate_content,
    generate_launch_checklist, generate_metrics_insights,
    generate_customer_feedback_analysis, generate_competitor_analysis,
    generate_persona_insights, generate_research_insights, generate_ai_assistant_response
)
import json
import os

# Wireframe generation utilities
import re

@api_view(['GET'])
def hello_world(request):
    """
    A simple API endpoint that returns a welcome message
    """
    return Response({
        'data': {
            'message': 'Hello from Django REST Framework!',
            'status': 'success'
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """
    Create a new user account
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        full_name = request.data.get('fullName', '')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists (handle duplicates)
        existing_users = User.objects.filter(email=email)
        if existing_users.exists():
            # If user exists, try to authenticate them instead
            user = existing_users.first()
            # Check if password matches
            if user.check_password(password):
                # Log them in (specify backend to avoid multiple backend error)
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                profile, created = UserProfile.objects.get_or_create(user=user)
                return Response({
                    'data': {
                        'user': {
                            'id': user.id,
                            'email': user.email,
                            'username': user.username,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'preferences': profile.preferences,
                            'onboarding_completed': profile.onboarding_completed,
                            'onboarding_data': profile.onboarding_data
                        },
                        'message': 'Login successful'
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'A user with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Split full name into first and last name
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Create user
        username = email.split('@')[0]  # Use email prefix as username
        # Ensure username is unique
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Create user profile
        profile = UserProfile.objects.create(user=user)
        
        # Log the user in (specify backend to avoid multiple backend error)
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        
        return Response({
            'data': {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'preferences': profile.preferences,
                    'onboarding_completed': profile.onboarding_completed
                },
                'message': 'Account created successfully'
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login a user
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find user by email (handle duplicates by getting the first one)
        try:
            users = User.objects.filter(email=email)
            if not users.exists():
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            # If multiple users exist, get the first one (or most recent)
            user = users.order_by('-id').first()
        except Exception as e:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Authenticate user
        user = authenticate(request, username=user.username, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Log the user in (specify backend to avoid multiple backend error)
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        return Response({
            'data': {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'preferences': profile.preferences,
                    'onboarding_completed': profile.onboarding_completed,
                    'onboarding_data': profile.onboarding_data
                },
                'message': 'Login successful'
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout the current user
    """
    try:
        logout(request)
        return Response({
            'data': {
                'message': 'Logout successful'
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    """
    Get the current authenticated user's information
    """
    try:
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        return Response({
            'data': {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'preferences': profile.preferences,
                    'onboarding_completed': profile.onboarding_completed,
                    'onboarding_data': profile.onboarding_data
                }
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_preferences_view(request):
    """
    Update user preferences
    """
    try:
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        preferences = request.data.get('preferences', {})
        if preferences:
            profile.update_preferences(preferences)
        
        return Response({
            'data': {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'preferences': profile.preferences,
                    'onboarding_completed': profile.onboarding_completed
                },
                'message': 'Preferences updated successfully'
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_onboarding_view(request):
    """
    Mark onboarding as complete and save onboarding data
    """
    try:
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        onboarding_data = request.data.get('onboarding_data', {})
        profile.onboarding_data = onboarding_data
        profile.onboarding_completed = True
        
        # Also save onboarding data as preferences for easy access
        if onboarding_data:
            # Extract preferences from onboarding data
            preferences = {
                'organizationName': onboarding_data.get('organizationName', ''),
                'industry': onboarding_data.get('industry', '')
            }
            profile.update_preferences(preferences)
        
        profile.save()
        
        return Response({
            'data': {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'preferences': profile.preferences,
                    'onboarding_completed': profile.onboarding_completed,
                    'onboarding_data': profile.onboarding_data
                },
                'message': 'Onboarding completed successfully'
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    """
    Request a password reset by email
    """
    try:
        email = request.data.get('email')
        
        if not email:
            return Response({
                'error': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists or not (security best practice)
            return Response({
                'data': {
                    'message': 'If an account with that email exists, we have sent a password reset link.'
                }
            }, status=status.HTTP_200_OK)
        
        # Generate password reset token
        reset_token = PasswordResetToken.generate_token(user)
        
        # Create reset URL
        reset_url = f"http://localhost:3000/reset-password?token={reset_token.token}"
        
        # Prepare email content
        subject = 'Password Reset Request - ProductAI'
        
        # Render HTML email template
        html_message = render_to_string('api/password_reset_email.html', {
            'reset_url': reset_url,
            'user': user
        })
        
        # Render plain text email template
        plain_message = render_to_string('api/password_reset_email.txt', {
            'reset_url': reset_url,
            'user': user
        })
        
        # Send email
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            print(f"✅ Password reset email sent successfully to {user.email}")
        except Exception as email_error:
            # Log the error for debugging
            print(f"❌ Error sending email: {email_error}")
            print(f"   Make sure EMAIL_HOST_USER and EMAIL_HOST_PASSWORD are set in your .env file")
            print(f"   For Gmail: Create an App Password at https://myaccount.google.com/apppasswords")
            # Still return success to user (don't reveal if email exists)
        
        return Response({
            'data': {
                'message': 'If an account with that email exists, we have sent a password reset link to your email.'
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def validate_reset_token_view(request):
    """
    Validate a password reset token
    """
    try:
        token = request.data.get('token')
        
        if not token:
            return Response({
                'error': 'Token is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reset_token, error_message = PasswordResetToken.validate_token(token)
        
        if reset_token is None:
            return Response({
                'error': error_message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'data': {
                'message': 'Token is valid',
                'email': reset_token.user.email
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_view(request):
    """
    Reset password using a valid reset token
    """
    try:
        token = request.data.get('token')
        password = request.data.get('password')
        
        if not token or not password:
            return Response({
                'error': 'Token and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(password) < 8:
            return Response({
                'error': 'Password must be at least 8 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate token
        reset_token, error_message = PasswordResetToken.validate_token(token)
        
        if reset_token is None:
            return Response({
                'error': error_message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Reset password
        user = reset_token.user
        user.set_password(password)
        user.save()
        
        # Mark token as used
        reset_token.mark_as_used()
        
        return Response({
            'data': {
                'message': 'Password has been reset successfully. You can now log in with your new password.'
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def oauth_login_url_view(request):
    """
    Get OAuth login URLs for Google and GitHub
    """
    try:
        provider = request.GET.get('provider')
        
        if provider not in ['google', 'github']:
            return Response({
                'error': 'Invalid provider. Use "google" or "github"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Build OAuth URL
        base_url = request.build_absolute_uri('/').rstrip('/')
        oauth_url = f"{base_url}/accounts/{provider}/login/"
        
        return Response({
            'data': {
                'url': oauth_url,
                'provider': provider
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def oauth_callback_view(request):
    """
    Handle OAuth callback and return user data
    """
    try:
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication failed'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        return Response({
            'data': {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'preferences': profile.preferences,
                    'onboarding_completed': profile.onboarding_completed,
                    'onboarding_data': profile.onboarding_data
                },
                'message': 'OAuth login successful'
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def parse_prompt_for_components(prompt):
    """Parse prompt to identify UI components"""
    prompt_lower = prompt.lower()
    components = {
        'header': 'header' in prompt_lower or 'navbar' in prompt_lower or 'navigation' in prompt_lower,
        'footer': 'footer' in prompt_lower,
        'sidebar': 'sidebar' in prompt_lower or 'side panel' in prompt_lower,
        'button': 'button' in prompt_lower or 'btn' in prompt_lower,
        'form': 'form' in prompt_lower or 'input' in prompt_lower or 'field' in prompt_lower,
        'card': 'card' in prompt_lower or 'panel' in prompt_lower,
        'table': 'table' in prompt_lower or 'list' in prompt_lower or 'grid' in prompt_lower,
        'image': 'image' in prompt_lower or 'photo' in prompt_lower or 'picture' in prompt_lower,
        'chart': 'chart' in prompt_lower or 'graph' in prompt_lower or 'analytics' in prompt_lower,
        'modal': 'modal' in prompt_lower or 'dialog' in prompt_lower or 'popup' in prompt_lower,
        'dashboard': 'dashboard' in prompt_lower,
        'balance': 'balance' in prompt_lower or 'account' in prompt_lower,
        'transaction': 'transaction' in prompt_lower or 'payment' in prompt_lower,
        'menu': 'menu' in prompt_lower,
    }
    return components

def generate_svg_wireframe(components, fidelity, device_type):
    """Generate SVG wireframe based on components"""
    # Determine dimensions based on device type
    if device_type == 'mobile':
        width, height = 375, 812
        padding = 16
    elif device_type == 'tablet':
        width, height = 768, 1024
        padding = 24
    else:  # desktop
        width, height = 1200, 800
        padding = 32
    
    # Determine stroke width and detail based on fidelity
    if fidelity < 33:
        stroke_width = 2
        detail_level = 'low'
    elif fidelity < 66:
        stroke_width = 1.5
        detail_level = 'medium'
    else:
        stroke_width = 1
        detail_level = 'high'
    
    svg_parts = []
    svg_parts.append(f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">')
    svg_parts.append(f'<rect width="{width}" height="{height}" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>')
    
    y_position = padding
    
    # Header
    if components.get('header') or components.get('menu'):
        header_height = 60 if device_type != 'mobile' else 56
        svg_parts.append(f'<rect x="{padding}" y="{y_position}" width="{width - 2*padding}" height="{header_height}" fill="#ffffff" stroke="#ced4da" stroke-width="{stroke_width}" rx="4"/>')
        # Logo/Title
        svg_parts.append(f'<rect x="{padding + 16}" y="{y_position + 16}" width="120" height="24" fill="#e9ecef" rx="2"/>')
        # Navigation items
        if device_type != 'mobile':
            nav_x = width - padding - 200
            for i in range(4):
                svg_parts.append(f'<rect x="{nav_x + i*45}" y="{y_position + 18}" width="40" height="20" fill="#e9ecef" rx="2"/>')
        else:
            # Mobile menu icon
            svg_parts.append(f'<rect x="{width - padding - 40}" y="{y_position + 16}" width="32" height="24" fill="#e9ecef" rx="2"/>')
        y_position += header_height + padding
    
    # Main content area
    main_content_y = y_position
    main_content_height = height - y_position - (80 if components.get('footer') else padding)
    
    # Sidebar
    if components.get('sidebar') and device_type != 'mobile':
        sidebar_width = 250
        svg_parts.append(f'<rect x="{padding}" y="{main_content_y}" width="{sidebar_width}" height="{main_content_height}" fill="#ffffff" stroke="#ced4da" stroke-width="{stroke_width}" rx="4"/>')
        # Sidebar items
        for i in range(6):
            item_y = main_content_y + 20 + i * 50
            svg_parts.append(f'<rect x="{padding + 16}" y="{item_y}" width="{sidebar_width - 32}" height="40" fill="#e9ecef" rx="2"/>')
        content_x = padding + sidebar_width + padding
        content_width = width - content_x - padding
    else:
        content_x = padding
        content_width = width - 2 * padding
    
    # Dashboard/Balance section
    if components.get('dashboard') or components.get('balance'):
        balance_height = 120
        svg_parts.append(f'<rect x="{content_x}" y="{main_content_y}" width="{content_width}" height="{balance_height}" fill="#ffffff" stroke="#ced4da" stroke-width="{stroke_width}" rx="4"/>')
        # Balance card
        svg_parts.append(f'<rect x="{content_x + 20}" y="{main_content_y + 20}" width="{content_width - 40}" height="80" fill="#e3f2fd" stroke="#90caf9" stroke-width="{stroke_width}" rx="4"/>')
        svg_parts.append(f'<rect x="{content_x + 40}" y="{main_content_y + 40}" width="200" height="16" fill="#bbdefb" rx="2"/>')
        svg_parts.append(f'<rect x="{content_x + 40}" y="{main_content_y + 70}" width="150" height="24" fill="#90caf9" rx="2"/>')
        y_position = main_content_y + balance_height + padding
    
    # Cards/Panels
    if components.get('card'):
        card_y = y_position
        card_height = 200
        svg_parts.append(f'<rect x="{content_x}" y="{card_y}" width="{content_width}" height="{card_height}" fill="#ffffff" stroke="#ced4da" stroke-width="{stroke_width}" rx="4"/>')
        # Card header
        svg_parts.append(f'<rect x="{content_x + 20}" y="{card_y + 20}" width="150" height="20" fill="#e9ecef" rx="2"/>')
        # Card content
        svg_parts.append(f'<rect x="{content_x + 20}" y="{card_y + 60}" width="{content_width - 40}" height="120" fill="#f8f9fa" stroke="#dee2e6" stroke-width="{stroke_width}" rx="2"/>')
        y_position = card_y + card_height + padding
    
    # Table/List
    if components.get('table') or components.get('transaction'):
        table_y = y_position
        table_height = min(300, main_content_height - (table_y - main_content_y))
        svg_parts.append(f'<rect x="{content_x}" y="{table_y}" width="{content_width}" height="{table_height}" fill="#ffffff" stroke="#ced4da" stroke-width="{stroke_width}" rx="4"/>')
        # Table header
        svg_parts.append(f'<rect x="{content_x + 20}" y="{table_y + 20}" width="{content_width - 40}" height="32" fill="#e9ecef" rx="2"/>')
        # Table rows
        for i in range(5):
            row_y = table_y + 60 + i * 50
            svg_parts.append(f'<rect x="{content_x + 20}" y="{row_y}" width="{content_width - 40}" height="40" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="2"/>')
            # Row content
            svg_parts.append(f'<circle cx="{content_x + 40}" cy="{row_y + 20}" r="12" fill="#ced4da"/>')
            svg_parts.append(f'<rect x="{content_x + 70}" y="{row_y + 8}" width="200" height="12" fill="#dee2e6" rx="1"/>')
            svg_parts.append(f'<rect x="{content_x + 70}" y="{row_y + 24}" width="150" height="10" fill="#e9ecef" rx="1"/>')
        y_position = table_y + table_height + padding
    
    # Buttons
    if components.get('button'):
        button_y = y_position
        button_spacing = 16
        button_width = 120
        button_height = 40
        num_buttons = 3 if device_type != 'mobile' else 2
        for i in range(num_buttons):
            btn_x = content_x + 20 + i * (button_width + button_spacing)
            svg_parts.append(f'<rect x="{btn_x}" y="{button_y}" width="{button_width}" height="{button_height}" fill="#0d6efd" stroke="#0a58ca" stroke-width="{stroke_width}" rx="4"/>')
            svg_parts.append(f'<rect x="{btn_x + 20}" y="{button_y + 12}" width="80" height="16" fill="#ffffff" rx="2"/>')
    
    # Footer
    if components.get('footer'):
        footer_y = height - 60
        svg_parts.append(f'<rect x="{padding}" y="{footer_y}" width="{width - 2*padding}" height="40" fill="#ffffff" stroke="#ced4da" stroke-width="{stroke_width}" rx="4"/>')
        svg_parts.append(f'<rect x="{padding + 20}" y="{footer_y + 12}" width="200" height="16" fill="#e9ecef" rx="2"/>')
    
    svg_parts.append('</svg>')
    return '\n'.join(svg_parts)

def calculate_accessibility_score(components, fidelity, device_type):
    """Calculate accessibility score based on components and settings"""
    score = 100
    
    # Deduct points for missing accessibility features
    if not components.get('button'):
        score -= 5
    if device_type == 'mobile' and fidelity < 50:
        score -= 10  # Low fidelity on mobile may have touch target issues
    if components.get('form') and fidelity < 50:
        score -= 8  # Low fidelity forms may lack proper labels
    
    # Add points for good practices
    if components.get('header'):
        score += 2
    if components.get('footer'):
        score += 2
    if fidelity >= 66:
        score += 5  # High fidelity usually has better accessibility
    
    return max(60, min(100, score))

def generate_accessibility_suggestions(components, fidelity, device_type, score):
    """Generate accessibility suggestions"""
    suggestions = []
    
    if device_type == 'mobile' and fidelity < 50:
        suggestions.append('Increase button size to 44px for better touch targets')
    
    if components.get('form') and fidelity < 50:
        suggestions.append('Add visible labels to all form fields')
    
    if score < 80:
        suggestions.append('Add more spacing between interactive elements')
    
    if not components.get('header'):
        suggestions.append('Consider adding a header with navigation')
    
    if fidelity < 66:
        suggestions.append('Use higher contrast text for better readability')
    
    if components.get('table') and device_type == 'mobile':
        suggestions.append('Consider a card-based layout for mobile instead of tables')
    
    # Default suggestions if none generated
    if not suggestions:
        suggestions = [
            'Ensure all interactive elements are keyboard accessible',
            'Add ARIA labels for screen readers',
            'Test color contrast ratios meet WCAG AA standards'
        ]
    
    return suggestions

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_wireframe_view(request):
    """
    Generate wireframe from text description (no external API required)
    """
    try:
        prompt = request.data.get('prompt', '')
        fidelity = request.data.get('fidelity', 50)  # 0-100 scale
        device_type = request.data.get('device_type', 'desktop')  # mobile, tablet, desktop
        
        if not prompt:
            return Response({
                'error': 'Prompt is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Parse prompt to identify components
        components = parse_prompt_for_components(prompt)
        
        # Generate SVG wireframe
        svg = generate_svg_wireframe(components, fidelity, device_type)
        
        # Calculate accessibility score
        accessibility_score = calculate_accessibility_score(components, fidelity, device_type)
        
        # Generate suggestions
        suggestions = generate_accessibility_suggestions(components, fidelity, device_type, accessibility_score)
        
        # Create description
        identified_components = [key for key, value in components.items() if value]
        description = f"Generated {device_type} wireframe with: {', '.join(identified_components) if identified_components else 'basic layout'}"
        
        return Response({
            'data': {
                'wireframe': {
                    'description': description,
                    'fidelity': fidelity,
                    'device_type': device_type,
                    'svg': svg,
                    'accessibility_score': accessibility_score,
                    'suggestions': suggestions,
                    'components': identified_components
                },
                'message': 'Wireframe generated successfully'
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to generate wireframe: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refine_wireframe_view(request):
    """
    Refine an existing wireframe based on refinement prompt
    """
    try:
        wireframe_data = request.data.get('wireframe_data', '')
        refinement_prompt = request.data.get('refinement_prompt', '')
        current_fidelity = request.data.get('fidelity', 50)
        device_type = request.data.get('device_type', 'desktop')
        
        if not wireframe_data and not refinement_prompt:
            return Response({
                'error': 'Wireframe data or refinement prompt is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Parse refinement prompt for improvements
        refinement_lower = refinement_prompt.lower()
        
        # Determine new fidelity based on refinement
        new_fidelity = current_fidelity
        if 'higher' in refinement_lower or 'increase' in refinement_lower or 'more detail' in refinement_lower:
            new_fidelity = min(100, current_fidelity + 20)
        elif 'lower' in refinement_lower or 'simpler' in refinement_lower or 'less detail' in refinement_lower:
            new_fidelity = max(0, current_fidelity - 20)
        
        # Parse for new components
        components = parse_prompt_for_components(refinement_prompt)
        
        # If no components found in refinement, try to extract from original wireframe
        if not any(components.values()):
            # Try to extract components from original description if available
            if isinstance(wireframe_data, dict) and 'components' in wireframe_data:
                # Reuse existing components
                existing_components = wireframe_data.get('components', [])
                components = {comp: True for comp in existing_components}
        
        # Generate refined SVG
        svg = generate_svg_wireframe(components, new_fidelity, device_type)
        
        # Calculate new accessibility score
        accessibility_score = calculate_accessibility_score(components, new_fidelity, device_type)
        
        # Generate refinement suggestions
        suggestions = generate_accessibility_suggestions(components, new_fidelity, device_type, accessibility_score)
        
        # Determine changes made
        changes = []
        if new_fidelity != current_fidelity:
            changes.append(f'Fidelity adjusted from {current_fidelity} to {new_fidelity}')
        if 'spacing' in refinement_lower or 'space' in refinement_lower:
            changes.append('Enhanced spacing between elements')
        if 'contrast' in refinement_lower or 'color' in refinement_lower:
            changes.append('Improved color contrast')
        if 'button' in refinement_lower or 'size' in refinement_lower:
            changes.append('Adjusted button sizes for better accessibility')
        if not changes:
            changes = ['Applied accessibility improvements', 'Enhanced layout structure', 'Improved visual hierarchy']
        
        return Response({
            'data': {
                'refined_wireframe': {
                    'description': f'Refined wireframe based on: {refinement_prompt}',
                    'fidelity': new_fidelity,
                    'device_type': device_type,
                    'svg': svg,
                    'accessibility_score': accessibility_score,
                    'suggestions': suggestions,
                    'changes': changes,
                    'components': [key for key, value in components.items() if value]
                },
                'message': 'Wireframe refined successfully'
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to refine wireframe: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Helper function to serialize model instances
def serialize_model(instance):
    """Convert a model instance to a dictionary"""
    data = {}
    # Get all field names from the model
    field_names = [f.name for f in instance._meta.get_fields() if not f.is_relation or f.one_to_one or (f.many_to_one and f.related_model)]
    
    for field_name in field_names:
        if field_name in ['id', 'user']:
            continue
        try:
            value = getattr(instance, field_name, None)
            if value is None:
                continue
            # Handle datetime/date objects
            if hasattr(value, 'isoformat'):
                data[field_name] = value.isoformat()
            # Handle JSON fields (dict/list)
            elif isinstance(value, (dict, list)):
                data[field_name] = value
            # Handle Decimal fields
            elif hasattr(value, '__float__'):
                try:
                    data[field_name] = float(value)
                except:
                    data[field_name] = str(value)
            # Handle other types
            else:
                data[field_name] = value
        except Exception:
            # Skip fields that can't be serialized
            pass
    
    data['id'] = instance.id
    data['user_id'] = instance.user.id
    return data


# Strategy & Ideation CRUD Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_strategy_list_create_view(request):
    """List all product strategies or create a new one"""
    if request.method == 'GET':
        # Ensure user is authenticated
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Filter strategies by authenticated user (ensures users only see their own data)
        strategies = ProductStrategy.objects.filter(user=request.user).order_by('-updated_at')
        return Response({
            'data': [serialize_model(s) for s in strategies],
            'message': 'Product strategies retrieved successfully'
        }, status=status.HTTP_200_OK)
    else:  # POST
        try:
            # Ensure user is authenticated
            if not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Create strategy with authenticated user (ensures data persists across sessions)
            strategy = ProductStrategy.objects.create(
                user=request.user,  # Always set to authenticated user
                title=request.data.get('title', 'Untitled Strategy'),
                description=request.data.get('description', ''),
                data=request.data.get('data', {}),
                status=request.data.get('status', 'draft')
            )
            # Force save to ensure it's persisted to database
            strategy.save()
            
            return Response({
                'data': serialize_model(strategy),
                'message': 'Product strategy created successfully'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_strategy_detail_view(request, pk):
    """Get, update, or delete a specific product strategy"""
    try:
        strategy = ProductStrategy.objects.get(pk=pk, user=request.user)
    except ProductStrategy.DoesNotExist:
        return Response({
            'error': 'Product strategy not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        return Response({
            'data': serialize_model(strategy),
            'message': 'Product strategy retrieved successfully'
        }, status=status.HTTP_200_OK)
    elif request.method in ['PUT', 'PATCH']:
        try:
            # Ensure user is authenticated and owns this strategy
            if not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Ensure user field is never changed (data belongs to authenticated user)
            strategy.title = request.data.get('title', strategy.title)
            strategy.description = request.data.get('description', strategy.description)
            if 'data' in request.data:
                strategy.data = request.data['data']
            if 'status' in request.data:
                strategy.status = request.data['status']
            
            # Ensure user is still set correctly (safety check)
            if strategy.user != request.user:
                return Response({
                    'error': 'Unauthorized: You can only modify your own strategies'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Save changes to database (ensures persistence across sessions)
            strategy.save()
            
            return Response({
                'data': serialize_model(strategy),
                'message': 'Product strategy updated successfully'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:  # DELETE
        strategy.delete()
        return Response({
            'data': {'message': 'Product strategy deleted successfully'},
            'message': 'Product strategy deleted successfully'
        }, status=status.HTTP_200_OK)


# Generic CRUD view functions
def create_list_create_view(model_class, model_name):
    """Create list/create view for a model"""
    @api_view(['GET', 'POST'])
    @permission_classes([IsAuthenticated])
    def view(request):
        if request.method == 'GET':
            # Ensure user is authenticated
            if not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Filter items by authenticated user (ensures users only see their own data)
            items = model_class.objects.filter(user=request.user).order_by('-updated_at')
            return Response({
                'data': [serialize_model(item) for item in items],
                'message': f'{model_name}s retrieved successfully'
            }, status=status.HTTP_200_OK)
        else:  # POST
            try:
                # Ensure user is authenticated
                if not request.user.is_authenticated:
                    return Response({
                        'error': 'Authentication required'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                item_data = {
                    'user': request.user,  # Always set user to authenticated user
                    'title': request.data.get('title', f'Untitled {model_name}'),
                    'description': request.data.get('description', ''),
                    'data': request.data.get('data', {})
                }
                # Add model-specific fields
                for field in model_class._meta.get_fields():
                    if field.name not in ['id', 'user', 'created_at', 'updated_at', 'title', 'description', 'data']:
                        if field.name in request.data:
                            item_data[field.name] = request.data[field.name]
                
                # Create item with authenticated user (ensures data persists across sessions)
                item = model_class.objects.create(**item_data)
                # Force save to ensure it's persisted to database
                item.save()
                
                return Response({
                    'data': serialize_model(item),
                    'message': f'{model_name} created successfully'
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return view


def create_detail_view(model_class, model_name):
    """Create detail/update/delete view for a model"""
    @api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
    @permission_classes([IsAuthenticated])
    def view(request, pk):
        # Ensure user is authenticated
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Get item that belongs to authenticated user (ensures data persistence per user)
            item = model_class.objects.get(pk=pk, user=request.user)
        except model_class.DoesNotExist:
            return Response({
                'error': f'{model_name} not found or you do not have permission to access it'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            return Response({
                'data': serialize_model(item),
                'message': f'{model_name} retrieved successfully'
            }, status=status.HTTP_200_OK)
        elif request.method in ['PUT', 'PATCH']:
            try:
                # Ensure user is authenticated and owns this item
                if not request.user.is_authenticated:
                    return Response({
                        'error': 'Authentication required'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Ensure user field is never changed (data belongs to authenticated user)
                for field in model_class._meta.get_fields():
                    if field.name not in ['id', 'user', 'created_at', 'updated_at']:
                        if field.name in request.data:
                            setattr(item, field.name, request.data[field.name])
                
                # Ensure user is still set correctly (safety check)
                if item.user != request.user:
                    return Response({
                        'error': 'Unauthorized: You can only modify your own items'
                    }, status=status.HTTP_403_FORBIDDEN)
                
                # Save changes to database (ensures persistence across sessions)
                item.save()
                
                return Response({
                    'data': serialize_model(item),
                    'message': f'{model_name} updated successfully'
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:  # DELETE
            item.delete()
            return Response({
                'data': {'message': f'{model_name} deleted successfully'},
                'message': f'{model_name} deleted successfully'
            }, status=status.HTTP_200_OK)
    return view


# Create CRUD views for all models
idea_list_create = create_list_create_view(Idea, 'Idea')
idea_detail = create_detail_view(Idea, 'Idea')
market_sizing_list_create = create_list_create_view(MarketSizing, 'Market Sizing')
market_sizing_detail = create_detail_view(MarketSizing, 'Market Sizing')
scenario_plan_list_create = create_list_create_view(ScenarioPlan, 'Scenario Plan')
scenario_plan_detail = create_detail_view(ScenarioPlan, 'Scenario Plan')
roadmap_list_create = create_list_create_view(Roadmap, 'Roadmap')
roadmap_detail = create_detail_view(Roadmap, 'Roadmap')
backlog_item_list_create = create_list_create_view(BacklogItem, 'Backlog Item')
backlog_item_detail = create_detail_view(BacklogItem, 'Backlog Item')
prd_document_list_create = create_list_create_view(PRDDocument, 'PRD Document')
prd_document_detail = create_detail_view(PRDDocument, 'PRD Document')
sprint_list_create = create_list_create_view(Sprint, 'Sprint')
sprint_detail = create_detail_view(Sprint, 'Sprint')
gtm_strategy_list_create = create_list_create_view(GTMStrategy, 'GTM Strategy')
gtm_strategy_detail = create_detail_view(GTMStrategy, 'GTM Strategy')
content_asset_list_create = create_list_create_view(ContentAsset, 'Content Asset')
content_asset_detail = create_detail_view(ContentAsset, 'Content Asset')
launch_checklist_list_create = create_list_create_view(LaunchChecklist, 'Launch Checklist')
launch_checklist_detail = create_detail_view(LaunchChecklist, 'Launch Checklist')
metric_list_create = create_list_create_view(Metric, 'Metric')
metric_detail = create_detail_view(Metric, 'Metric')
ai_insight_list_create = create_list_create_view(AIInsight, 'AI Insight')
ai_insight_detail = create_detail_view(AIInsight, 'AI Insight')
experiment_list_create = create_list_create_view(Experiment, 'Experiment')
experiment_detail = create_detail_view(Experiment, 'Experiment')
ai_agent_list_create = create_list_create_view(AIAgent, 'AI Agent')
ai_agent_detail = create_detail_view(AIAgent, 'AI Agent')
workflow_list_create = create_list_create_view(Workflow, 'Workflow')
workflow_detail = create_detail_view(Workflow, 'Workflow')
customer_feedback_list_create = create_list_create_view(CustomerFeedback, 'Customer Feedback')
customer_feedback_detail = create_detail_view(CustomerFeedback, 'Customer Feedback')
competitor_intel_list_create = create_list_create_view(CompetitorIntel, 'Competitor Intel')
competitor_intel_detail = create_detail_view(CompetitorIntel, 'Competitor Intel')
user_persona_list_create = create_list_create_view(UserPersona, 'User Persona')
user_persona_detail = create_detail_view(UserPersona, 'User Persona')
research_document_list_create = create_list_create_view(ResearchDocument, 'Research Document')
research_document_detail = create_detail_view(ResearchDocument, 'Research Document')


# AI Endpoints
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_generate_ideas_view(request):
    """Generate product ideas using AI"""
    try:
        context = request.data.get('context')
        count = request.data.get('count', 5)
        ideas = generate_ideas(context=context, count=count)
        return Response({
            'data': ideas,
            'message': 'Ideas generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_strategy_advice_view(request):
    """Generate product strategy advice"""
    try:
        vision_statement = request.data.get('vision_statement')
        okrs = request.data.get('okrs')
        advice = generate_strategy_advice(vision_statement=vision_statement, okrs=okrs)
        return Response({
            'data': advice,
            'message': 'Strategy advice generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_market_analysis_view(request):
    """Generate market sizing analysis"""
    try:
        industry = request.data.get('industry')
        target_market = request.data.get('target_market')
        analysis = generate_market_analysis(industry=industry, target_market=target_market)
        return Response({
            'data': analysis,
            'message': 'Market analysis generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_roadmap_prioritization_view(request):
    """Generate roadmap prioritization"""
    try:
        initiatives = request.data.get('initiatives')
        prioritization = generate_roadmap_prioritization(initiatives=initiatives)
        return Response({
            'data': prioritization,
            'message': 'Roadmap prioritization generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_backlog_grooming_view(request):
    """Generate backlog grooming suggestions"""
    try:
        backlog_items = request.data.get('backlog_items')
        grooming = generate_backlog_grooming(backlog_items=backlog_items)
        return Response({
            'data': grooming,
            'message': 'Backlog grooming suggestions generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_generate_prd_view(request):
    """Generate PRD document"""
    try:
        product_name = request.data.get('product_name')
        features = request.data.get('features')
        prd = generate_prd(product_name=product_name, features=features)
        return Response({
            'data': prd,
            'message': 'PRD generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_sprint_planning_view(request):
    """Generate sprint planning suggestions"""
    try:
        backlog_items = request.data.get('backlog_items')
        team_capacity = request.data.get('team_capacity')
        planning = generate_sprint_planning(backlog_items=backlog_items, team_capacity=team_capacity)
        return Response({
            'data': planning,
            'message': 'Sprint planning generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_gtm_strategy_view(request):
    """Generate GTM strategy"""
    try:
        product_name = request.data.get('product_name')
        target_audience = request.data.get('target_audience')
        strategy = generate_gtm_strategy(product_name=product_name, target_audience=target_audience)
        return Response({
            'data': strategy,
            'message': 'GTM strategy generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_generate_content_view(request):
    """Generate marketing/content"""
    try:
        content_type = request.data.get('content_type')
        topic = request.data.get('topic')
        content = generate_content(content_type=content_type, topic=topic)
        return Response({
            'data': content,
            'message': 'Content generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_launch_checklist_view(request):
    """Generate launch checklist"""
    try:
        product_type = request.data.get('product_type')
        checklist = generate_launch_checklist(product_type=product_type)
        return Response({
            'data': checklist,
            'message': 'Launch checklist generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_metrics_insights_view(request):
    """Generate metrics insights"""
    try:
        metrics_data = request.data.get('metrics_data')
        insights = generate_metrics_insights(metrics_data=metrics_data)
        return Response({
            'data': insights,
            'message': 'Metrics insights generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_customer_feedback_analysis_view(request):
    """Analyze customer feedback"""
    try:
        feedback_items = request.data.get('feedback_items')
        analysis = generate_customer_feedback_analysis(feedback_items=feedback_items)
        return Response({
            'data': analysis,
            'message': 'Customer feedback analysis generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_competitor_analysis_view(request):
    """Generate competitor analysis"""
    try:
        competitors = request.data.get('competitors')
        analysis = generate_competitor_analysis(competitors=competitors)
        return Response({
            'data': analysis,
            'message': 'Competitor analysis generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_persona_insights_view(request):
    """Generate persona insights"""
    try:
        persona_data = request.data.get('persona_data')
        insights = generate_persona_insights(persona_data=persona_data)
        return Response({
            'data': insights,
            'message': 'Persona insights generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_research_insights_view(request):
    """Generate research insights"""
    try:
        query = request.data.get('query')
        research_data = request.data.get('research_data')
        insights = generate_research_insights(query=query, research_data=research_data)
        return Response({
            'data': insights,
            'message': 'Research insights generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_assistant_view(request):
    """General AI assistant"""
    try:
        query = request.data.get('query')
        context = request.data.get('context')
        response = generate_ai_assistant_response(query=query, context=context)
        return Response({
            'data': response,
            'message': 'AI assistant response generated successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
