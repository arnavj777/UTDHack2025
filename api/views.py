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
from .models import UserProfile, PasswordResetToken
import json

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
