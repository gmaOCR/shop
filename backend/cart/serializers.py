from rest_framework import serializers
from .models import Cart, CartItem
from user.serializers import CustomUserSerializer


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True, required=False)
    items = CartItemSerializer(many=True, read_only=True)
    session_id = serializers.CharField(required=False)

    class Meta:
        model = Cart
        fields = ['id', 'user', "items", "session_id"]
