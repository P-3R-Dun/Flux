from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.db.models.signals import post_delete
import os

User = get_user_model()

class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallets')
    name = models.CharField(max_length=50)
    currency = models.CharField(max_length=3, default='UAH')
    icon_name = models.CharField(max_length=50, default='Wallet')
    is_active = models.BooleanField(default=False)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='profile')

    CURRENCY_CHOICES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('UAH', 'UAH'),
    ]

    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='UAH')
    financial_period = models.CharField(max_length=20, default='monthly')
    focus_streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def save(self, *args, **kwargs):
        try:
            old_instance = UserProfile.objects.get(pk=self.pk)
            if old_instance.profile_picture and old_instance.profile_picture != self.profile_picture:
                if os.path.isfile(old_instance.profile_picture.path):
                    os.remove(old_instance.profile_picture.path)
        except UserProfile.DoesNotExist:
            pass

        super().save(*args, **kwargs)

@receiver(post_delete, sender=UserProfile)
def delete_profile_picture_on_delete(sender, instance, **kwargs):
    if instance.profile_picture:
        if os.path.isfile(instance.profile_picture.path):
            os.remove(instance.profile_picture.path)

class Category(models.Model):
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='categories')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    icon_name = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name', 'type'], name='unique_category_per_user_and_type')
        ]

class Goal(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='goals')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=30)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'title'], name='unique_goal_title_per_user')
        ]

    @property
    def current_amount(self):
        total = self.transactions.aggregate(total=Sum('amount'))['total']
        return total if total is not None else 0

class Transaction(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    brand_logo_url = models.URLField(null=True, blank=True)

@receiver(post_save, sender=User)
def setup_new_user_data(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
        Wallet.objects.create(
            user=instance,
            name="Основний рахунок",
            icon_name="Wallet",
            is_active=True
        )

class Templates(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions_templates')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions_templates')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions_templates')
    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions_templates')
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    name = models.CharField(max_length=100)
    template_name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    brand_logo_url = models.URLField(null=True, blank=True)

default_categories = [
            {'name': 'Groceries', 'type': 'expense', 'icon_name': 'ShoppingCart'},
            {'name': 'Dining Out', 'type': 'expense', 'icon_name': 'Coffee'},
            {'name': 'Housing & Utilities', 'type': 'expense', 'icon_name': 'Building2'},
            {'name': 'Transportation', 'type': 'expense', 'icon_name': 'Van'},
            {'name': 'Health & Medical', 'type': 'expense', 'icon_name': 'ScanHeart'},
            {'name': 'Subscriptions & Services', 'type': 'expense', 'icon_name': 'Pointer'},
            {'name': 'Shopping & Personal Care', 'type': 'expense', 'icon_name': 'Handbag'},
            {'name': 'Entertainment & Hobbies', 'type': 'expense', 'icon_name': 'Gamepad2'},
            {'name': 'Other', 'type': 'expense', 'icon_name': 'Ellipsis'},

            {'name': 'Salary', 'type': 'income', 'icon_name': 'CircleDollarSign'},
            {'name': 'Freelance', 'type': 'income', 'icon_name': 'Coins'},
            {'name': 'Investments', 'type': 'income', 'icon_name': 'Bitcoin'},
            {'name': 'Rental Income', 'type': 'income', 'icon_name': 'HousePlus'},
            {'name': 'Cashback', 'type': 'income', 'icon_name': 'BanknoteArrowDown'},
            {'name': 'Gifts', 'type': 'income', 'icon_name': 'Gift'},
            {'name': 'Benefits', 'type': 'income', 'icon_name': 'Landmark'},
            {'name': 'Business Profit', 'type': 'income', 'icon_name': 'BriefcaseBusiness'},
            {'name': 'Other', 'type': 'income', 'icon_name': 'Ellipsis'}
        ]