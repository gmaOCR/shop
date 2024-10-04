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
    scent = serializers.PrimaryKeyRelatedField(
        queryset=Scent.objects.all(), required=False, allow_null=True)
    color = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image',
                  'stock', 'length', 'width', 'height', 'scent', 'color']
