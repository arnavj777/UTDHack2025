from django.contrib import admin
from .models import PRD

@admin.register(PRD)
class PRDAdmin(admin.ModelAdmin):
    list_display = ['id', 'feature_name', 'owner', 'status', 'target_release', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at']
    search_fields = ['feature_name', 'owner']
