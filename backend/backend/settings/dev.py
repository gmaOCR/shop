from .base import *
from datetime import timedelta

DEBUG = True

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=90),  # Durée de vie du token d'accès
    'REFRESH_TOKEN_LIFETIME': timedelta(days=90),  # Durée de vie du token de rafraîchissement
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

STATIC_URL = '/static/'
