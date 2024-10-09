from django.conf import settings
import os
from celery.schedules import crontab
from backend.settings.base import DEBUG
from celery import Celery
if DEBUG:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.dev')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.prod')

from django import setup
setup()


app = Celery('backend')
app.config_from_object('backend.celery_app.celeryconfig', namespace='CELERY')

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

app.conf.CELERY_LOG_FILE = os.path.join(
    os.path.dirname(__file__), 'logs', 'celery.log')
app.conf.CELERY_LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
app.conf.CELERY_LOG_LEVEL = 'INFO'


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


app.conf.beat_schedule = {
    'delete-expired-carts': {
        'task': 'cart.tasks.delete_expired_carts',
        'schedule': crontab(minute='*/15'),
    }
}
