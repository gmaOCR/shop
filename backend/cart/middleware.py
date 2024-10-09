# import hashlib
# from django.utils.deprecation import MiddlewareMixin
# from .models import Cart
# from django.db import transaction


# class CartMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         if request.user.is_authenticated:
#             # Utilisateur authentifié
#             with transaction.atomic():
#                 cart, created = Cart.objects.select_for_update().get_or_create(user=request.user)
#                 if created:
#                     print(
#                         f"Nouveau panier créé pour l'utilisateur: {request.user.username}")
#         else:
#             # Utilisateur anonyme
#             unique_id = self.get_unique_identifier(request)
#             with transaction.atomic():
#                 cart, created = Cart.objects.select_for_update().get_or_create(session_id=unique_id)
#                 if created:
#                     print(
#                         f"Nouveau panier créé avec l'identifiant de session: {unique_id}")

#         request.cart = cart
#         return None

#     def get_unique_identifier(self, request):
#         # Combiner plusieurs sources d'information pour créer un identifiant unique
#         components = [
#             request.META.get('REMOTE_ADDR', ''),  # IP de l'utilisateur
#             request.META.get('HTTP_USER_AGENT', ''),  # User Agent
#             request.session.session_key or '',  # Clé de session
#         ]
#         if request.user.is_authenticated:
#             # ID de l'utilisateur si connecté
#             components.append(str(request.user.id))

#         # Créer un hash de ces composants
#         unique_string = ''.join(components).encode('utf-8')
#         return hashlib.md5(unique_string).hexdigest()
