from rest_framework import serializers
from .models import UserProfile, Transaction

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    goal_title = serializers.ReadOnlyField(source='goal.title')
    class Meta:
        model = Transaction
        fields = ('id', 'amount', 'date', 'description', 'brand_logo_url', 'category', 'goal', 'category_name', 'goal_title')

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    transactions = TransactionSerializer(many=True, read_only=True, source='user.transactions')

    class Meta:
        model = UserProfile
        fields = ('first_name',
                  'last_name',
                  'email',
                  'username',
                  'currency',
                  'financial_period',
                  'focus_streak',
                  'profile_picture',
                  'transactions'
                  )


