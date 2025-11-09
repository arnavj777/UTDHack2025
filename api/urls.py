from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'prds', views.PRDViewSet, basename='prd')

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('', include(router.urls)),
]
