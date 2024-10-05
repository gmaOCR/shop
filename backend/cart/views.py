from rest_framework import generics, viewsets
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny, IsAuthenticated

from common.xlsrenderer import CustomXLSXRenderer
from .models import Cart
from .serializers import CartSerializer

import uuid


class CartList(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAdminUser]


class CartDetailAuthenticated(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)


class CartDetailAnonymous(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'session_id'
    permission_classes = [AllowAny]

    def get_queryset(self):
        session_id = self.request.COOKIES.get('sessionid')
        if not session_id:
            session_id = uuid.uuid4()
            self.request.COOKIES['sessionid'] = session_id
        return Cart.objects.filter(session_id=session_id)

    def retrieve(self, request, *args, **kwargs):
        session_id = request.COOKIES.get('sessionid')

        if not session_id:
            session_id = uuid.uuid4()
            response = super().retrieve(request, *args, **kwargs)

            cart = Cart.objects.create(session_id=session_id)
            response.set_cookie('sessionid', session_id, max_age=900)

            return Response(CartSerializer(cart).data)
        else:
            queryset = self.get_queryset()
            cart = queryset.first()
            if not cart:
                cart = Cart.objects.create(session_id=session_id)
                return Response(CartSerializer(cart).data)

            return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.last_updated = timezone.now()
        instance.save()
        return super().update(request, *args, **kwargs)


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
