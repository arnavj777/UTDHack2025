from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

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
def login_view(request):
    """
    User login endpoint
    """
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required',
                'detail': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to get user by email (Django User model uses username, but we can check email)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Try username as fallback
            try:
                user = User.objects.get(username=email)
            except User.DoesNotExist:
                return Response({
                    'error': 'Invalid credentials',
                    'detail': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Authenticate user
        user = authenticate(request, username=user.username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                'data': {
                    'token': 'session-token',  # In production, use JWT or token auth
                    'user': {
                        'id': user.id,
                        'email': user.email or user.username,
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    },
                    'message': 'Login successful'
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials',
                'detail': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'error': 'Login failed',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """
    User signup endpoint
    """
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        username = data.get('username', email.split('@')[0] if email else 'user')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required',
                'detail': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'User already exists',
                'detail': 'A user with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            # Generate unique username
            counter = 1
            original_username = username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Log in the user
        login(request, user)
        
        return Response({
            'data': {
                'token': 'session-token',  # In production, use JWT or token auth
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'message': 'Account created successfully'
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': 'Signup failed',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint
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
            'error': 'Logout failed',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    """
    Get current user information
    """
    try:
        user = request.user
        return Response({
            'data': {
                'id': user.id,
                'email': user.email or user.username,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Failed to get user',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
