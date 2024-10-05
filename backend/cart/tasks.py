from celery import shared_task
from django.utils import timezone
from .models import Cart
from django.conf import settings


@shared_task
def delete_expired_carts():
    if settings.DEBUG:
        expiration_date = timezone.now() - timezone.timedelta(minutes=1)
    else:
        expiration_date = timezone.now() - timezone.timedelta(days=30)
    Cart.objects.filter(user=None, created_at__lte=expiration_date).delete()
