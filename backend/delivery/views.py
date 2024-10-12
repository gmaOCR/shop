from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser

from common.xlsrenderer import CustomXLSXRenderer
from .models import Order
from .serializers import OrderSerializer


# class ProductViewSet(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer
#     renderer_classes = [CustomXLSXRenderer]
#     filename = 'products_export.xlsx'

#     def list(self, request, *args, **kwargs):
#         response = super().list(request, *args, **kwargs)
#         response['Content-Disposition'] = f'attachment; filename="{self.filename}"'
#         return response
