import pytest
from rest_framework.test import APIClient
from django.test.client import RequestFactory
from django.http import HttpResponse
from cart.middleware import CartMiddleware
from cart.models import Cart
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


@pytest.fixture
def request_factory():
    return RequestFactory()


@pytest.fixture
def middleware():
    return CartMiddleware(lambda request: HttpResponse())


@pytest.fixture
def base_url():
    return 'http://localhost:8000/api/carts/'


@pytest.fixture
@pytest.mark.django_db
def user():
    return User.objects.create_user(username='testuser', password='password')


@pytest.fixture
@pytest.mark.django_db
def admin():
    return User.objects.create_superuser(username='admin', password='password')


@pytest.fixture
def cart_user(user):
    return Cart.objects.create(user=user)


@pytest.fixture
def cart_anonym(user):
    return Cart.objects.create(session_id="123e4567-e89b-12d3-a456-426655440000")


@pytest.fixture
def anonymous_cart():
    session_id = uuid.uuid4()
    return Cart.objects.create(session_id=session_id)


@pytest.fixture
def api_client():
    return APIClient()
