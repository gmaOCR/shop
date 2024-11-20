from django.conf import settings
from oscar.apps.basket.models import Basket
import inspect
import traceback

if settings.DEBUG:
    class DebugMiddleware:
        def __init__(self, get_response):
            self.get_response = get_response
            self.excluded_users = ['admin', 'superuser']
            self.last_request_info = {
                'path': None,
                'method': None,
                'user': None,
                'stack_trace': None
            }
            # Stockage du nombre initial de paniers
            self.initial_basket_count = Basket.objects.count()

        def capture_request_context(self, request):
            # Capture des informations détaillées sur la requête
            self.last_request_info = {
                'path': request.path,
                'method': request.method,
                'user': request.user.username if request.user.is_authenticated else 'AnonymousUser',
                'stack_trace': traceback.extract_stack()
            }

        def __call__(self, request):
            # Capture du contexte de la requête
            self.capture_request_context(request)

            # Vérification du nombre de paniers après la requête
            response = self.get_response(request)

            # Compte le nombre de paniers après la requête
            current_basket_count = Basket.objects.count()

            # Condition : vérifier si le nombre de paniers a augmenté
            if current_basket_count > self.initial_basket_count:
                print("\n🚨 Nouvelle création de panier 🚨")
                print(f"Nombre de paniers avant : {self.initial_basket_count}")
                print(f"Nombre de paniers après : {current_basket_count}")
                print("\n--- Contexte de la requête ---")
                print(f"Chemin : {self.last_request_info['path']}")
                print(f"Méthode : {self.last_request_info['method']}")
                print(f"Utilisateur : {self.last_request_info['user']}")

                print("\n--- Trace de la pile ---")
                # Affichage des 10 derniers frames de la pile
                for frame in self.last_request_info['stack_trace'][-10:]:
                    print(
                        f"  File: {frame.filename}, Line: {frame.lineno}, in {frame.name}")

                # Déclenchement de pdb
                # import pdb
                # import django
                # django.setup()
                # pdb.set_trace()

            # Mise à jour du compte initial pour la prochaine requête
            self.initial_basket_count = current_basket_count

            return response
