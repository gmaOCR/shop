class DebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f"Session ID: {request.session.session_key}")
        print(f"User: {request.user}")

        # Vérifiez si l'authentification DRF est utilisée
        if hasattr(request, 'auth'):
            print(f"Auth: {request.auth}")
        else:
            print("Auth: Not available")

        # Informations supplémentaires utiles
        print(f"Method: {request.method}")
        print(f"Path: {request.path}")
        print(f"GET params: {request.GET}")
        print(f"POST params: {request.POST}")
        print(f"Headers: {request.headers}")

        response = self.get_response(request)

        # Informations sur la réponse
        print(f"Response status: {response.status_code}")

        return response
