# from django.utils.deprecation import MiddlewareMixin
from .models import Cart
import uuid


class CartMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/static/') or request.path.startswith('/media/'):
            return self.get_response(request)

        session_id = request.COOKIES.get('sessionid')
        if not session_id:
            session_id = uuid.uuid4()
            request.COOKIES['sessionid'] = session_id
            request.session['cart_created'] = False

        if not request.session.get('cart_created'):
            session_id = str(uuid.uuid4()).strip('"')
            Cart.objects.create(session_id=session_id)
            request.session['cart_created'] = True

        return self.get_response(request)
