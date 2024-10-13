from .base import *
from datetime import timedelta
from oscar.defaults import *

DEBUG = True

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=90),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=90),
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
        'ATOMIC_REQUESTS': True,
    }
}

CORS_ALLOW_ALL_ORIGINS = True

STATIC_URL = '/static/'

# Utiliser le backend de session par défaut (base de données)
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# Durée de vie de la session (2 semaines)
SESSION_COOKIE_AGE = 1209600

# Désactiver le flag 'secure' pour permettre l'utilisation en HTTP
SESSION_COOKIE_SECURE = False

# Permettre l'accès JavaScript au cookie de session (facilite le débogage)
SESSION_COOKIE_HTTPONLY = False

# Désactiver SameSite pour faciliter le développement local
SESSION_COOKIE_SAMESITE = None


INSTALLED_APPS += ['django_extensions', 'schema_graph',]
