from rest_framework import serializers
from user.serializers import CustomUserSerializer
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'updated_at', 'total_price']
