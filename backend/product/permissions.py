from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée permettant à tout le monde de lire,
    mais seulement aux administrateurs de modifier.
    """
    def has_permission(self, request, view):
        # Autoriser toute lecture (GET, HEAD ou OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Sinon, n'autoriser que les administrateurs
        return request.user and request.user.is_staff
