from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser

from common.xlsrenderer import CustomXLSXRenderer
from .models import Product
from .serializers import ProductSerializer
from .permissions import IsAdminOrReadOnly 


class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    renderer_classes = [CustomXLSXRenderer]
    filename = 'products_export.xlsx'

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Content-Disposition'] = f'attachment; filename="{self.filename}"'
        return response