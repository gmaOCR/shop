from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .models import Cart


class CartMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            # Utilisateur authentifié, on peut continuer
            return None
        else:
            # Utilisateur invité, vérifie si le cookie de session existe
            session_id = request.COOKIES.get('sessionid')
            if session_id:
                # Vérifie si le panier existe pour cette session_id
                cart = Cart.objects.filter(session_id=session_id).first()
                if not cart:
                    # Si aucun panier n'existe, on pourrait créer un panier vide
                    Cart.objects.create(session_id=session_id)
            return None
