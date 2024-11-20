from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from oscar.apps.order.models import Order
import stripe

stripe.api_key = settings.STRIPE_TEST_API_KEY


class PaymentView(APIView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        try:
            # import pdb
            # pdb.set_trace()
            data = request.data
            intent = stripe.PaymentIntent.create(
                amount=self.calculate_order_amount(
                    data['items']),
                currency='usd',  # Changez la devise si nécessaire
                automatic_payment_methods={'enabled': True},
            )
            return Response({
                'clientSecret': intent['client_secret'],
                'dpmCheckerLink': f'https://dashboard.stripe.com/settings/payment_methods/review?transaction_id={intent["id"]}',
            }, status=status.HTTP_200_OK)
        except Exception as e:

            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

    def calculate_order_amount(self, items):
        return 1400


# class StripeWebhookView(APIView):
    # @csrf_exempt
    # def post(self, request, *args, **kwargs):
    #     payload = request.body
    #     sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    #     endpoint_secret = settings.STRIPE_ENDPOINT_SECRET

    #     try:
    #         event = stripe.Webhook.construct_event(
    #             payload, sig_header, endpoint_secret)
    #     except ValueError as e:
    #         return Response({'error': 'Invalid payload', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    #     except stripe.error.SignatureVerificationError as e:
    #         return Response({'error': 'Invalid signature', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    #     # Gérer l'événement selon son type
    #     if event['type'] == 'payment_intent.succeeded':
    #         payment_intent = event['data']['object']
    #         # Mettez à jour votre base de données ou l'état de la commande ici

    #     return Response({'status': 'success'}, status=status.HTTP_200_OK)
