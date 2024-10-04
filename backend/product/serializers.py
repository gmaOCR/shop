from rest_framework import serializers
from .models import Product, Color, Scent


class ScentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scent
        fields = ['id', 'name']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    scent = ScentSerializer()
    color = ColorSerializer()

    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image',
                  'stock', 'length', 'width', 'height', 'scent', 'color']
