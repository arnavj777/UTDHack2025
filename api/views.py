from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def hello_world(request):
    """
    A simple API endpoint that returns a welcome message
    """
    return Response({
        'message': 'Hello from Django REST Framework!',
        'status': 'success'
    }, status=status.HTTP_200_OK)
