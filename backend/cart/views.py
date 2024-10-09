from rest_framework import generics, viewsets
from django.utils import timezone
from rest_framework import status
from functools import wraps
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny, IsAuthenticated
from common.xlsrenderer import CustomXLSXRenderer
from .models import Cart
from .serializers import CartSerializer, CartItemSerializer


def forbidden(view_func):
    @wraps(view_func)
    def wrapper(*args, **kwargs):
        return Response({"error": "Method not allowed"}, status=status.HTTP_403_FORBIDDEN)
    return wrapper


class CartList(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAdminUser]


class CartDetailAuthenticated(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Cart.objects.get(user=self.request.user)


class CartDetailAnonymous(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'session_id'
    permission_classes = [AllowAny]

    def get_queryset(self):
        session_id = self.request.COOKIES.get('session_id')
        return Cart.objects.filter(session_id=session_id)

    @forbidden
    def create(self, request, *args, **kwargs):
        pass

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.last_updated = timezone.now()
        instance.save()
        return super().update(request, *args, **kwargs)


class CartViewSet(viewsets.ModelViewSet):  # pragma: no cover
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    renderer_classes = [CustomXLSXRenderer]
    filename = 'carts_export.xlsx'

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Content-Disposition'] = f'attachment; filename="{self.filename}"'
        return response
