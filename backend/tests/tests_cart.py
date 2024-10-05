import pytest
from django.test.client import RequestFactory
from django.http import HttpResponse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from cart.models import Cart
from cart.middleware import CartMiddleware
import uuid


# Nota: Pas de token JWT sur la requete => 401
# sinon permission Django echec => 403

User = get_user_model()


@pytest.fixture
def request_factory():
    return RequestFactory()


@pytest.fixture
def middleware():
    return CartMiddleware(lambda request: HttpResponse())


@pytest.fixture
def base_url():
    return 'http://localhost:8000/api/'


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
def anonymous_cart():
    session_id = uuid.uuid4()
    return Cart.objects.create(session_id=session_id)


@pytest.fixture
def api_client():
    return APIClient()


def test_get_carts_list_anonymous(api_client, base_url):
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_get_cart_list_authenticated(api_client, user, base_url):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_get_cart_detail_anonymous(api_client, base_url, anonymous_cart):
    # session anonyme gérée par cookie via ID
    session_id = anonymous_cart.session_id
    api_client.cookies['sessionid'] = session_id

    response = api_client.get(f'{base_url}cart/anon/{session_id}/')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_cart_detail_authenticated(api_client, user, base_url):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}cart/auth/')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_cart_viewset_list_with_anonymous(api_client, base_url):
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_get_cart_viewset_list_with_user(api_client, base_url, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_get_cart_viewset_list_with_admin(api_client, base_url, admin):
    api_client.force_authenticate(user=admin)
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_post_cart_create_anonymous(api_client, base_url, anonymous_cart):
    # Configurer le cookie de session pour l'utilisateur anonyme
    api_client.cookies['sessionid'] = anonymous_cart.session_id
    response = api_client.post(f'{base_url}cart/anon/', {})
    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_cart_middleware_creates_cart_on_first_request(middleware, request_factory):
    request = request_factory.get('/')
    request.COOKIES = {}
    request.session = {}

    middleware(request)

    assert 'sessionid' in request.COOKIES
    assert request.session['cart_created']
    assert Cart.objects.count() == 1


@pytest.mark.django_db
def test_cart_middleware_does_not_create_cart_on_subsequent_requests(middleware, request_factory):
    request = request_factory.get('/')
    request.COOKIES = {'sessionid': '123456'}
    request.session = {'cart_created': True}

    middleware(request)

    assert Cart.objects.count() == 0


@pytest.mark.django_db
def test_cart_middleware_skips_cart_creation_for_static_requests(middleware, request_factory):
    request = request_factory.get('/static/image.jpg')
    request.COOKIES = {}
    request.session = {}

    middleware(request)

    assert 'sessionid' not in request.COOKIES
    assert not request.session.get('cart_created')
    assert Cart.objects.count() == 0
