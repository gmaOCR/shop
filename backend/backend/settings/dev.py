from .base import *
from datetime import timedelta
from oscar.defaults import *
from decouple import config


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}


DEBUG = True

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=90),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=90),
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': 'db.sqlite3',
#         'USER': '',
#         'PASSWORD': '',
#         'HOST': '',
#         'PORT': '',
#         'ATOMIC_REQUESTS': True,
#         "TIMEOUT": 30,
#     }
# }


CORS_ALLOW_ALL_ORIGINS = True

STATIC_URL = '/static/'

# Utiliser le backend de session par défaut (base de données)
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

SESSION_COOKIE_AGE = 6000

# Désactiver le flag 'secure' pour permettre l'utilisation en HTTP
SESSION_COOKIE_SECURE = False

# Permettre l'accès JavaScript au cookie de session (facilite le débogage)
SESSION_COOKIE_HTTPONLY = False

# Désactiver SameSite pour faciliter le développement local
SESSION_COOKIE_SAMESITE = None

OSCAR_BASKET_COOKIE_LIFETIME = 10

INSTALLED_APPS += ['django_extensions', 'schema_graph',]

MIDDLEWARE += ['backend.middleware.DebugMiddleware',]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':
        ('rest_framework.authentication.BasicAuthentication',
         'rest_framework_simplejwt.authentication.JWTAuthentication',
         'rest_framework.authentication.SessionAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': [],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
        'drf_excel.renderers.XLSXRenderer',
    ),
}

CORS_ORIGIN_ALLOW_ALL = True

print("-------------------------"
      "Developement config LOADED"
      "-------------------------")
