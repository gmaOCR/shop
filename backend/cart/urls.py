from django.urls import path
from .views import CartViewSet, CartList, CartDetailAuthenticated, CartCreate, CartDetailAnonymous
from django.conf import settings

urlpatterns = [
    path('', CartList.as_view(), name='cart-list'),
    path('auth/', CartDetailAuthenticated.as_view(),
         name='cart-detail-auth'),
    path('anon/<session_id>/', CartDetailAnonymous.as_view(),
         name='cart-detail-anon'),
]

if settings.DEBUG:
    urlpatterns.append(path('export/', CartViewSet.as_view({'get': 'list'})))
