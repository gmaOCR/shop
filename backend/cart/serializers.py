from rest_framework import serializers
from .models import Cart, CartItem
from product.serializers import ProductSerializer 
from user.serializers import CustomUserSerializer  

class CartSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'updated_at'] 

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity']  
