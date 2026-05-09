import requests
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import UserProfile, Category, Transaction, Templates
from .serializers import UserProfileSerializer, TransactionSerializer, CategorySerializer, TemplateSerializer
from django.http import Http404

class CurrentUserProfileView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer
    def get_object(self):
        try:
            profile = self.request.user.profile
            today = timezone.now().date()
            if profile.last_active_date != today:
                if profile.last_active_date == today - timedelta(days=1):
                    profile.focus_streak += 1
                else:
                    profile.focus_streak = 1
                profile.last_active_date = today
                profile.save()
            return profile
        except UserProfile.DoesNotExist:
            raise Http404

class CategoryView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        categories = Category.objects.filter(Q(is_default=True) | Q(user=request.user))

        category_type = request.query_params.get('type')

        if category_type in ['income', 'expense']:
            categories = categories.filter(type=category_type)

        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TransactionCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class BrandFetchView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        query = request.GET.get('query', '')
        if query:
            query = query.strip()

            search_url = f"https://api.logo.dev/search?q={query}"

            headers = {
                "Authorization": f"Bearer {settings.LOGO_DEV_API_KEY}"
            }

            try:
                response = requests.get(search_url, headers=headers, timeout=3)
                if response.status_code == 200:
                    results = []
                    data = response.json()
                    if data and isinstance(data, list) and len(data) > 0:
                        for item in data:
                            results.append({
                                "name": item.get('name'),
                                "domain": item.get('domain'),
                                "brand_logo_url": f"https://img.logo.dev/{item.get('domain')}?token={settings.LOGO_DEV_PUBLIC_KEY}"
                            })

                        return Response(results)
                    else:
                        return Response([])

            except requests.RequestException:
                return Response({"error": "External API is unavailable!"}, status=503)

        return Response({"error": "Bad Response!"}, status=503)

class TransactionDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class TemplateCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Templates.objects.all()
    serializer_class = TemplateSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TemplateView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        templates = Templates.objects.filter(user=request.user)
        serializer = TemplateSerializer(templates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TemplateUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TemplateSerializer

    def get_queryset(self):
        return Templates.objects.filter(user=self.request.user)

class TemplateDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TemplateSerializer

    def get_queryset(self):
        return Templates.objects.filter(user=self.request.user)