from django.urls import path
from .views import SmartRecoveryView

urlpatterns = [
    path('recover/', SmartRecoveryView.as_view(), name='smart_recovery'),
]