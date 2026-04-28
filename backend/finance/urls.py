from django.urls import path
from .views import CurrentUserProfileView, TransactionCreateView, CategoryView, BrandFetchView, TransactionUpdateView, TransactionDeleteView

urlpatterns = [
    path('profile/me/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('transactions/create/', TransactionCreateView.as_view(), name='transaction-create'),
    path('categories/view/', CategoryView.as_view(), name='category-list'),
    path('brands/search/', BrandFetchView.as_view(), name='brand-search'),
    path('transactions/<int:pk>/update/', TransactionUpdateView.as_view(), name='transaction-update'),
    path('transactions/<int:pk>/delete/', TransactionDeleteView.as_view(), name='transaction-delete')
]
