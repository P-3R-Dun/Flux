from django.urls import path
from .views import CurrentUserProfileView, TransactionCreateView

urlpatterns = [
    path('profile/me/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('transactions/create/', TransactionCreateView.as_view(), name='transaction-create'),
]

