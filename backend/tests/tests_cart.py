import pytest
from django.test import RequestFactory
from fixtures_cart import *
from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from rest_framework import status
from cart.middleware import CartMiddleware


# Nota: Pas de token JWT sur la requete => 401
# sinon permission Django echec => 403


@pytest.mark.django_db
def test_get_carts_list_anonymous(api_client, base_url):
    response = api_client.get(f'{base_url}')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_get_cart_list_authenticated(api_client, user, base_url):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}')
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_get_cart_detail_anonymous(api_client, base_url, anonymous_cart):
    # session anonyme gérée par cookie via ID
    session_id = anonymous_cart.session_id
    api_client.cookies['session_id'] = session_id

    response = api_client.get(f'{base_url}anon/{session_id}/')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_cart_detail_authenticated(api_client, user, base_url, cart_user):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}auth/')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_cart_viewset_list_with_anonymous(api_client, base_url):
    response = api_client.get(f'{base_url}')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_get_cart_viewset_list_with_user(api_client, base_url, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}')
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_get_cart_viewset_list_with_admin(api_client, base_url, admin):
    api_client.force_authenticate(user=admin)
    response = api_client.get(f'{base_url}')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_cart_middleware_creates_cart_on_first_request(middleware, request_factory):
    request = request_factory.get('/')
    request.COOKIES = {}
    request.session = {}
    request.user = AnonymousUser()

    middleware(request)

    assert 'session_id' in request.COOKIES
    assert Cart.objects.count() == 1


@pytest.mark.django_db
def test_cart_middleware_does_not_create_cart_on_subsequent_requests(middleware, request_factory, cart_anonym):
    request = request_factory.get('/')
    request.COOKIES = {'session_id': '123e4567-e89b-12d3-a456-426655440000'}
    request.user = AnonymousUser()

    middleware(request)

    assert Cart.objects.count() == 1
    assert str(
        Cart.objects.get().session_id) == "123e4567-e89b-12d3-a456-426655440000"


@pytest.mark.django_db
def test_cart_middleware_skips_cart_creation_for_static_requests(middleware, request_factory):
    request = request_factory.get('/static/image.jpg')
    request.COOKIES = {}
    request.session = {}

    middleware(request)

    assert 'session_id' not in request.COOKIES
    assert Cart.objects.count() == 0


@pytest.mark.django_db
def test_cart_middleware_single_creation():
    # 1. Créer une requête pour simuler un utilisateur anonyme
    factory = RequestFactory()
    request = factory.get('/')

    # 2.  Appliquer SessionMiddleware pour initialiser la session
    session_middleware = SessionMiddleware(get_response=lambda req: req)
    session_middleware.process_request(request)
    request.session.save()

    # 3. Appliquer AuthenticationMiddleware pour gérer l'utilisateur anonyme
    auth_middleware = AuthenticationMiddleware(get_response=lambda req: req)
    auth_middleware.process_request(request)

    # 4. Appliquer CartMiddleware pour la première fois
    cart_middleware = CartMiddleware(get_response=lambda req: req)
    cart_middleware.process_request(request)

    # 5. Vérifier si un panier a été créé et obtenir son ID
    assert hasattr(request, 'cart')
    first_cart_id = request.cart.id

    #  ---- Deuxième requête -----

    # 6. Créer une nouvelle requête
    request = factory.get('/')

    # 7. Appliquer SessionMiddleware pour utiliser la même session
    session_middleware.process_request(request)
    request.COOKIES = {'sessionid': request.session.session_key}

    # 8.  Appliquer AuthenticationMiddleware  (toujours nécessaire)
    auth_middleware.process_request(request)

    # 9. Appliquer CartMiddleware pour la deuxième fois
    cart_middleware.process_request(request)

    # 10. Vérifier si le panier est le même que celui de la première requête
    assert hasattr(request, 'cart')
    second_cart_id = request.cart.id
    assert first_cart_id == second_cart_id, "Un nouveau panier a été créé pour le même utilisateur anonyme."
