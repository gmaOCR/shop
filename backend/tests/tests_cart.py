import pytest
from django.test.client import RequestFactory
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from cart.models import Cart
import uuid


# Nota: Pas de token JWT sur la requete => 401
# sinon permission Django echec => 403

User = get_user_model()


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


def test_cart_list_anonymous(api_client, base_url):
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_cart_list_authenticated(api_client, user, base_url):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_cart_detail_anonymous(api_client, base_url, anonymous_cart):
    # session anonyme gérée par cookie via ID
    session_id = anonymous_cart.session_id
    api_client.cookies['sessionid'] = session_id

    response = api_client.get(f'{base_url}cart/{anonymous_cart.pk}/')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_cart_detail_authenticated(api_client, user, cart_user, base_url):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}cart/{cart_user.pk}/')
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_cart_create_anonymous(api_client, base_url, anonymous_cart):
    # Configurer le cookie de session pour l'utilisateur anonyme
    api_client.cookies['sessionid'] = anonymous_cart.session_id
    response = api_client.post(f'{base_url}cart/create/', {})
    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_cart_viewset_list_with_anonymous(api_client, base_url):
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_cart_viewset_list_with_user(api_client, base_url, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_cart_viewset_list_with_user(api_client, base_url, admin):
    api_client.force_authenticate(user=admin)
    response = api_client.get(f'{base_url}cart/')
    assert response.status_code == status.HTTP_200_OK
