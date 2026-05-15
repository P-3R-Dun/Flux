from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .email import PasswordResetEmail, ActivationEmail

User = get_user_model()

class SmartRecoveryView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        email_address = request.data.get('email')

        if not email_address:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email__iexact=email_address).first()

        if user:
            if user.is_active:
                reset_email = PasswordResetEmail(context={'user': user})
                reset_email.send([email_address])
            else:
                activation_email = ActivationEmail(context={'user': user})
                activation_email.send([email_address])

        return Response(status=status.HTTP_204_NO_CONTENT)