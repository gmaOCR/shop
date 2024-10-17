from django.urls import path, include
from .views import hello_world, CustomTokenObtainPairView, TokenRefreshView, csrf_token_view


urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('csrf-token/', csrf_token_view, name='csrf-token'),
    # path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
