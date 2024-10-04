from django.urls import path, include
from .views import hello_world, CustomTokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('hello/', hello_world, name='hello_world'),

    path('products/', include('product.urls')),
    path('cart/', include('cart.urls')),
    path('users/', include('user.urls')),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
