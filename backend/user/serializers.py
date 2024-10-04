from django.contrib.auth import get_user_model
from rest_framework import serializers
from phonenumber_field.modelfields import PhoneNumberField

class CustomUserSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField()

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number']
