from django.urls import path
from .views import ProductList, ProductDetail, ProductViewSet
from django.conf import settings

urlpatterns = [
    path('', ProductList.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetail.as_view(), name='product-detail'),
]

if settings.DEBUG:
    urlpatterns.append(path('export/', ProductViewSet.as_view({'get': 'list'})))
    