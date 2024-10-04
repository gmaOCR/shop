from rest_framework import generics, viewsets
from django_ratelimit.decorators import ratelimit
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny

from common.xlsrenderer import CustomXLSXRenderer
from .models import Cart
from .serializers import CartSerializer


class CartList(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAdminUser]


class CartDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    # Permet aux invités de lire
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        else:
            session_id = self.request.COOKIES.get('sessionid')
            return Cart.objects.filter(session_id=session_id)


class CartCreate(generics.CreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    # def perform_create(self, serializer):
    #     # voir middleware.py de l'app pour cette partie


class CartViewSet(viewsets.ModelViewSet):  # pragma: no cover
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    renderer_classes = [CustomXLSXRenderer]
    filename = 'carts_export.xlsx'

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Content-Disposition'] = f'attachment; filename="{self.filename}"'
        return response
