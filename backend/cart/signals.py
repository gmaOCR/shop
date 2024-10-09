# signals.py
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
from django.core.signals import request_started
from django.db.models.signals import pre_save
from .models import Cart


@receiver(user_logged_in)
def create_cart_for_user(sender, user, request, **kwargs):
    # Create a cart for the user if it doesn't exist
    cart, created = Cart.objects.select_for_update().get_or_create(user=user)
    if created:
        print(f"Nouveau panier créé pour l'utilisateur: {user.username}")

    # Set the cart on the request
    request.cart = cart
