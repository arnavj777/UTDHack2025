from django.db import models

class PRD(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('review', 'In Review'),
        ('approved', 'Approved'),
    ]

    # Basic Metadata
    feature_name = models.CharField(max_length=200, default='')
    owner = models.CharField(max_length=100, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    target_release = models.DateField(null=True, blank=True)

    # Problem Section
    problem_statement = models.TextField(default='', blank=True)
    customer_pain_points = models.JSONField(default=list, blank=True)  # Array of strings
    supporting_data = models.JSONField(default=list, blank=True)  # Array of strings

    # Goals Section
    goals = models.JSONField(default=list, blank=True)  # Array of objects: {goal: str, keyResults: str}
    key_results = models.TextField(default='', blank=True)

    # Requirements Section
    functional_requirements = models.JSONField(default=list, blank=True)  # Array of objects

    # Metrics Section
    metrics = models.JSONField(default=list, blank=True)  # Array of objects

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.feature_name or f'PRD #{self.id}'
