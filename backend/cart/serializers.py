from rest_framework import serializers
from .models import Cart, CartItem
from user.serializers import CustomUserSerializer


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product', 'quantity']

    def validate(self, data):
        product = data['product']
        quantity = data['quantity']

        if quantity > product.product.stock:
            raise serializers.ValidationError(
                f"La quantité demandée ({quantity}) dépasse le stock "
                f"disponible ({product.product.stock}) pour {product.product.name}.")

        return data


class CartSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True, required=False)
    items = CartItemSerializer(many=True, read_only=True)
    session_id = serializers.CharField(required=False)
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', "items", "session_id", "items"]
