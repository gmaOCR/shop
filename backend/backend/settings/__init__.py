# myproject/settings/__init__.py

import os

environment = os.getenv('DJANGO_ENV')

if environment == 'production':
    from .prod import *
else:
    from .dev import *
