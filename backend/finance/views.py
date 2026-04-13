import requests
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import UserProfile
from .serializers import UserProfileSerializer, TransactionSerializer

class CurrentUserProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class TransactionCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TransactionSerializer

    def perform_create(self, serializer):
        brand_logo_url = None
        description = serializer.validated_data.get('description')

        if description:
            query = description.strip()

            search_url = f"https://api.brandfetch.io/v2/search/{query}"

            headers = {
                "Authorization": f"Bearer {settings.BRANDFETCH_API_KEY}"
            }

            try:
                response = requests.get(search_url, headers=headers, timeout=3)
                if response.status_code == 200:
                    data = response.json()
                    if data and isinstance(data, list) and len(data) > 0:
                        first_match = data[0]
                        domain = first_match['domain']
                        brand_logo_url = f'https://cdn.brandfetch.io/{domain}/fallback/transparent/format/svg'


            except requests.RequestException:
                pass

        serializer.save(
            user=self.request.user,
            brand_logo_url=brand_logo_url
        )