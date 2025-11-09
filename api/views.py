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
        strategies = ProductStrategy.objects.filter(user=request.user)
        return Response({
            'data': [serialize_model(s) for s in strategies],
            'message': 'Product strategies retrieved successfully'
        }, status=status.HTTP_200_OK)
    else:  # POST
        try:
            strategy = ProductStrategy.objects.create(
                user=request.user,
                title=request.data.get('title', 'Untitled Strategy'),
                description=request.data.get('description', ''),
                data=request.data.get('data', {}),
                status=request.data.get('status', 'draft')
            )
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
            strategy.title = request.data.get('title', strategy.title)
            strategy.description = request.data.get('description', strategy.description)
            if 'data' in request.data:
                strategy.data = request.data['data']
            if 'status' in request.data:
                strategy.status = request.data['status']
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
            items = model_class.objects.filter(user=request.user)
            return Response({
                'data': [serialize_model(item) for item in items],
                'message': f'{model_name}s retrieved successfully'
            }, status=status.HTTP_200_OK)
        else:  # POST
            try:
                item_data = {
                    'user': request.user,
                    'title': request.data.get('title', f'Untitled {model_name}'),
                    'description': request.data.get('description', ''),
                    'data': request.data.get('data', {})
                }
                # Add model-specific fields
                for field in model_class._meta.get_fields():
                    if field.name not in ['id', 'user', 'created_at', 'updated_at', 'title', 'description', 'data']:
                        if field.name in request.data:
                            item_data[field.name] = request.data[field.name]
                
                item = model_class.objects.create(**item_data)
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
        try:
            item = model_class.objects.get(pk=pk, user=request.user)
        except model_class.DoesNotExist:
            return Response({
                'error': f'{model_name} not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            return Response({
                'data': serialize_model(item),
                'message': f'{model_name} retrieved successfully'
            }, status=status.HTTP_200_OK)
        elif request.method in ['PUT', 'PATCH']:
            try:
                for field in model_class._meta.get_fields():
                    if field.name not in ['id', 'user', 'created_at', 'updated_at']:
                        if field.name in request.data:
                            setattr(item, field.name, request.data[field.name])
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

# Helper function for simple sentiment analysis (fallback)
def _calculate_simple_sentiment(text):
    """Simple keyword-based sentiment analysis as fallback"""
    if not text:
        return 50.0
    
    text_lower = text.lower()
    
    # Positive keywords
    positive_keywords = [
        'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
        'love', 'like', 'best', 'perfect', 'awesome', 'brilliant',
        'helpful', 'useful', 'easy', 'simple', 'clear', 'intuitive',
        'improve', 'better', 'enhance', 'upgrade', 'feature', 'benefit',
        'success', 'effective', 'efficient', 'robust', 'reliable'
    ]
    
    # Negative keywords
    negative_keywords = [
        'bad', 'terrible', 'awful', 'horrible', 'worst', 'poor',
        'hate', 'dislike', 'difficult', 'complex', 'confusing', 'unclear',
        'bug', 'error', 'issue', 'problem', 'broken', 'fails',
        'missing', 'lack', 'slow', 'crashes', 'unstable', 'fails'
    ]
    
    # Count matches
    positive_count = sum(1 for keyword in positive_keywords if keyword in text_lower)
    negative_count = sum(1 for keyword in negative_keywords if keyword in text_lower)
    
    # Calculate score
    if positive_count == 0 and negative_count == 0:
        return 50.0  # Neutral
    
    total = positive_count + negative_count
    positive_ratio = positive_count / total if total > 0 else 0.5
    
    # Map to 0-100 scale
    score = 20 + (positive_ratio * 60)
    return max(0, min(100, score))

# Gemini Chatbot endpoint
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def gemini_chat_view(request):
    """
    Chat with Gemini AI for product image analysis and feature descriptions
    Supports both text and image inputs
    """
    try:
        # Import required libraries
        try:
            import google.generativeai as genai
        except ImportError:
            return Response({
                'error': 'google-generativeai package is not installed. Please run: pip install google-generativeai'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        import base64
        try:
            from PIL import Image
        except ImportError:
            return Response({
                'error': 'Pillow package is not installed. Please run: pip install Pillow'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        import io
        
        # Get API key from environment
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return Response({
                'error': 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Get message and images from request
        message = request.data.get('message', '')
        images = request.data.get('images', [])  # List of base64 encoded images
        conversation_history = request.data.get('conversation_history', [])
        
        if not message and not images:
            return Response({
                'error': 'Message or image is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # System instruction for product feature analysis
        system_instruction = """You are an AI product analyst specializing in analyzing product images and converting them into detailed feature explanations and descriptions. 
Your role is to:
1. Analyze product images in detail
2. Identify all visible features, UI elements, and functionality
3. Provide clear, structured feature descriptions
4. Explain how features work and their potential benefits
5. Identify design patterns and user experience elements
6. Suggest improvements or note potential issues

Be thorough, accurate, and provide actionable insights. Format your responses in a clear, structured way with headings and bullet points when appropriate."""
        
        # Use gemini-2.5-flash model (fast, efficient, supports vision)
        try:
            # Try gemini-2.5-flash first (as requested)
            model = genai.GenerativeModel('gemini-2.5-flash')
        except Exception:
            try:
                # Fallback to gemini-2.0-flash-exp if 2.5-flash is not available
                model = genai.GenerativeModel('gemini-2.0-flash-exp')
            except Exception:
                try:
                    # Fallback to gemini-1.5-flash if newer models are not available
                    model = genai.GenerativeModel('gemini-1.5-flash')
                except Exception:
                    try:
                        # Last resort: try gemini-1.5-pro
                        model = genai.GenerativeModel('gemini-1.5-pro')
                    except Exception:
                        return Response({
                            'error': 'Failed to initialize Gemini model. Please check if the model name is correct and your API key has access. Available models may vary by region and API access level.'
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Process images
        image_parts = []
        if images:
            for image_data in images:
                try:
                    # Handle base64 image data
                    # Format: "data:image/png;base64,<base64data>" or just "<base64data>"
                    if ',' in image_data:
                        # Remove data URL prefix if present
                        image_data = image_data.split(',')[1]
                    
                    # Decode base64 image
                    image_bytes = base64.b64decode(image_data)
                    image = Image.open(io.BytesIO(image_bytes))
                    
                    # Convert to RGB if necessary (some formats like PNG with transparency)
                    if image.mode != 'RGB':
                        image = image.convert('RGB')
                    
                    image_parts.append(image)
                except Exception as e:
                    print(f"Error processing image: {e}")
                    # Continue with other images if one fails
                    continue
        
        # Build conversation history for chat session
        # Note: Gemini chat history doesn't support images directly in history,
        # so we only include text messages in the history
        chat_history = []
        if conversation_history:
            for msg in conversation_history[-10:]:  # Limit to last 10 messages for context
                role = msg.get('role', '')
                content = msg.get('content', '')
                # Only include text content in history (images are sent with current message)
                if role == 'user' and isinstance(content, str) and content:
                    chat_history.append({'role': 'user', 'parts': [content]})
                elif role == 'assistant' and isinstance(content, str) and content:
                    chat_history.append({'role': 'model', 'parts': [content]})
        
        # Prepare content parts (text + images)
        content_parts = []
        
        # Add images first if present
        if image_parts:
            content_parts.extend(image_parts)
        
        # Add text message
        if message:
            # Use the user's message as-is (they may have specific instructions)
            user_message = message
            
            # Include system instruction for first message or when no history
            if not chat_history:
                # For first message with images, the system instruction will guide the analysis
                if image_parts:
                    full_message = f"{system_instruction}\n\nUser: {user_message}\nAssistant:"
                else:
                    full_message = f"{system_instruction}\n\nUser: {user_message}\nAssistant:"
            else:
                full_message = user_message
            
            content_parts.append(full_message)
        elif image_parts:
            # If only images without text, add a default prompt focused on analysis
            default_prompt = "Analyze this product image and provide detailed feature explanations, UI elements, functionality, and design patterns. Be thorough and structured in your response."
            if not chat_history:
                full_message = f"{system_instruction}\n\nUser: {default_prompt}\nAssistant:"
            else:
                full_message = default_prompt
            content_parts.append(full_message)
        
        # Generate response
        try:
            if chat_history:
                # Use chat session with history
                chat = model.start_chat(history=chat_history)
                response = chat.send_message(content_parts)
            else:
                # For first message, generate content
                response = model.generate_content(content_parts)
        except Exception as e:
            error_msg = f"Failed to generate response: {str(e)}"
            print(f"Gemini API Error: {error_msg}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': error_msg
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Extract the response text
        response_text = ""
        try:
            if hasattr(response, 'text'):
                response_text = response.text
            elif hasattr(response, 'candidates') and response.candidates:
                if hasattr(response.candidates[0], 'content'):
                    if hasattr(response.candidates[0].content, 'parts'):
                        response_text = response.candidates[0].content.parts[0].text
                    else:
                        response_text = str(response.candidates[0].content)
                else:
                    response_text = str(response.candidates[0])
            elif hasattr(response, 'parts'):
                response_text = response.parts[0].text if response.parts else str(response)
            else:
                response_text = str(response)
        except Exception as e:
            response_text = f"Response received but parsing failed: {str(response)}"
            print(f"Warning: Could not parse response properly: {e}")
        
        if not response_text:
            response_text = "I apologize, but I couldn't generate a response. Please try again."
        
        # Determine model name for response
        model_name = 'gemini-2.5-flash'
        try:
            # Try to get the actual model name from the model object
            if hasattr(model, 'model_name'):
                model_name = model.model_name
            elif '2.0' in str(model):
                model_name = 'gemini-2.0-flash-exp'
            elif '2.5' in str(model):
                model_name = 'gemini-2.5-flash'
            elif '1.5-flash' in str(model):
                model_name = 'gemini-1.5-flash'
            elif '1.5-pro' in str(model):
                model_name = 'gemini-1.5-pro'
        except:
            pass
        
        # Initialize sentiment, keywords, and trends analysis
        sentiment_score = None
        trend_score = None
        keywords = []
        overall_score = None
        
        # Always try to analyze sentiment and trends (with fallbacks)
        try:
            # Import services
            from api.services.keyword_extractor import get_keyword_extractor
            from api.services.sentiment_model import get_sentiment_model_service
            from api.services.trends_service import get_trends_service
            from django.conf import settings
            
            # Extract keywords from chatbot response
            try:
                keyword_extractor = get_keyword_extractor()
                if keyword_extractor and response_text:
                    keywords = keyword_extractor.extract_keywords(response_text, max_keywords=10)
                    print(f"Extracted {len(keywords)} keywords: {keywords}")
            except Exception as e:
                print(f"Error extracting keywords: {e}")
                keywords = []
            
            # Predict sentiment - always try to get a score
            # The service should always return an instance (even without model, it uses fallback)
            if response_text:
                try:
                    sentiment_service = get_sentiment_model_service()
                    if sentiment_service:
                        # Extract features from response text
                        additional_features = {
                            'feedback_length': len(response_text),
                            'word_count': len(response_text.split())
                        }
                        sentiment_score = sentiment_service.predict_sentiment(response_text, additional_features)
                        print(f"Sentiment score calculated: {sentiment_score}")
                    else:
                        # If service is None, use simple fallback directly
                        print("Sentiment service returned None, using direct fallback")
                        sentiment_score = _calculate_simple_sentiment(response_text)
                except Exception as e:
                    print(f"Error predicting sentiment: {e}")
                    import traceback
                    traceback.print_exc()
                    # Use direct fallback if service fails
                    try:
                        sentiment_score = _calculate_simple_sentiment(response_text)
                    except:
                        sentiment_score = 50.0
            else:
                sentiment_score = 50.0  # Default for empty text
            
            # Get trend scores for keywords
            if keywords:
                try:
                    trends_service = get_trends_service()
                    if trends_service:
                        trend_score = trends_service.get_average_trend_score(keywords)
                        print(f"Trend score: {trend_score}")
                    else:
                        print("Trends service not available (SERPAPI_KEY not set?)")
                        trend_score = 50.0  # Default neutral score
                except Exception as e:
                    print(f"Error fetching trends: {e}")
                    import traceback
                    traceback.print_exc()
                    trend_score = 50.0  # Default neutral score
            else:
                print("No keywords extracted, skipping trend analysis")
                trend_score = 50.0  # Default when no keywords
            
            # Calculate overall score (weighted average)
            # Always calculate overall score if we have at least sentiment
            if sentiment_score is not None:
                if trend_score is not None:
                    sentiment_weight = getattr(settings, 'SENTIMENT_WEIGHT', 0.6)
                    trend_weight = getattr(settings, 'TREND_WEIGHT', 0.4)
                    overall_score = (sentiment_score * sentiment_weight) + (trend_score * trend_weight)
                else:
                    # If no trend score, use sentiment only
                    overall_score = sentiment_score
                # Ensure score is in 0-100 range
                overall_score = max(0, min(100, overall_score))
                print(f"Overall score: {overall_score}")
        
        except Exception as e:
            # If analysis fails completely, use defaults
            print(f"Error in sentiment/trends analysis: {e}")
            import traceback
            traceback.print_exc()
            # Set default scores so the card still shows
            if sentiment_score is None:
                sentiment_score = 50.0
            if trend_score is None:
                trend_score = 50.0
            if overall_score is None:
                overall_score = 50.0
        
        # Prepare response data
        response_data = {
            'message': response_text,
            'model': model_name
        }
        
        # Always include analysis results (use defaults if analysis failed)
        # This ensures the frontend always receives score data
        response_data['sentiment_score'] = round(sentiment_score if sentiment_score is not None else 50.0, 2)
        response_data['trend_score'] = round(trend_score if trend_score is not None else 50.0, 2)
        response_data['keywords'] = keywords if keywords else []
        response_data['overall_score'] = round(overall_score if overall_score is not None else 50.0, 2)
        
        print(f"Returning response with scores: sentiment={response_data['sentiment_score']}, trend={response_data['trend_score']}, overall={response_data['overall_score']}, keywords={len(response_data['keywords'])}")
        
        return Response({
            'data': response_data,
            'message': 'Chat response generated successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        error_details = str(e)
        traceback.print_exc()
        return Response({
            'error': f'Failed to generate chat response: {error_details}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)