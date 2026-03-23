from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    CURRENCY_CHOICES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('UAH', 'UAH'),
    ]

    FINANCIAL_PERIOD_CHOICES = [
        ('week', 'week'),
        ('month', 'month'),
        ('year', 'year'),
    ]

    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='UAH')
    financial_period = models.CharField(max_length=5, choices=FINANCIAL_PERIOD_CHOICES, default='week')
    daily_cap_streak = models.IntegerField(default=0)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    name = models.CharField(max_length=50)
    type = models.CharField(max_length=7, choices=TYPE_CHOICES)
    icon_path = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    title = models.CharField(max_length=50)
    target_amount = models.DecimalField(decimal_places=2, max_digits=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    current_amount =models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    deadline = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, null=True, blank=True)

    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    type = models.CharField(max_length=7, choices=TYPE_CHOICES)
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    date = models.DateTimeField()
    description = models.TextField(null=True, blank=True)