from rest_framework import serializers
from .models import PRD

class PRDSerializer(serializers.ModelSerializer):
    target_release = serializers.DateField(allow_null=True, required=False)
    
    def validate_target_release(self, value):
        # Convert empty string to None
        if value == '':
            return None
        return value
    
    class Meta:
        model = PRD
        fields = [
            'id',
            'feature_name',
            'owner',
            'status',
            'target_release',
            'problem_statement',
            'customer_pain_points',
            'supporting_data',
            'goals',
            'key_results',
            'functional_requirements',
            'metrics',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

