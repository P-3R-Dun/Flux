from rest_framework import serializers
from .models import UserProfile, Transaction, Category, Templates, Wallet

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ('id', 'name', 'currency', 'icon_name', 'is_active')

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    goal_title = serializers.ReadOnlyField(source='goal.title')
    class Meta:
        model = Transaction
        fields = ('id', 'amount', 'date', 'name', 'description', 'brand_logo_url', 'category', 'goal', 'category_name', 'goal_title', 'wallet')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'icon_name', 'is_default', 'type')


class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    transactions = serializers.SerializerMethodField()
    wallets = WalletSerializer(many=True, read_only=True, source='user.wallets')

    class Meta:
        model = UserProfile
        fields = (
            'first_name',
            'last_name',
            'email',
            'username',
            'focus_streak',
            'profile_picture',
            'transactions',
            'wallets'
        )

    def get_transactions(self, obj):
        active_transactions = Transaction.objects.filter(
            user=obj.user,
            wallet__is_active=True
        ).order_by('-date')
        return TransactionSerializer(active_transactions, many=True).data

class TemplateSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    goal_title = serializers.ReadOnlyField(source='goal.title')

    class Meta:
        model = Templates
        fields = (
            'id',
            'template_name',
            'amount',
            'name',
            'description',
            'brand_logo_url',
            'category',
            'goal',
            'category_name',
            'goal_title',
            'wallet'
        )