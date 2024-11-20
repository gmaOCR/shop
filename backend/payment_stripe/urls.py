from django.urls import path
from .views import PaymentView

urlpatterns = [
    path('api-payment/', PaymentView.as_view(), name='api-payment'),
    # path('stripe-webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
]
