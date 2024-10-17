from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.middleware.csrf import get_token


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)


def csrf_token_view(request):
    token = get_token(request)
    return JsonResponse({'csrf_token': token})


class CustomTokenObtainPairView(TokenObtainPairView):
    pass
