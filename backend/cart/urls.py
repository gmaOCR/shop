from django.urls import path
from .views import CartViewSet, CartList, CartDetail, CartCreate
from django.conf import settings

urlpatterns = [
    path('', CartList.as_view(), name='cart-list'),
    path('create/', CartCreate.as_view(), name='cart-create'),
    path('<int:pk>/', CartDetail.as_view(), name='cart-detail'),
]

if settings.DEBUG:
    urlpatterns.append(path('export/', CartViewSet.as_view({'get': 'list'})))
