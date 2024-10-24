from oscar.apps.shipping import methods
from oscar.core.prices import Price
from decimal import Decimal as D
from django.utils.translation import gettext_lazy as _


class CustomFixedPrice(methods.FixedPrice):
    def __init__(self, charge_excl_tax=None, charge_incl_tax=None, currency=None):
        super().__init__(charge_excl_tax, charge_incl_tax)
        self.currency = currency

    def calculate(self, basket):
        return Price(
            currency=self.currency,
            excl_tax=self.charge_excl_tax,
            incl_tax=self.charge_excl_tax
        )


class Standard(CustomFixedPrice):
    code = 'standard'
    name = _('Standard shipping')
    charge_excl_tax = D('7.00')

    def __init__(self):
        super().__init__(charge_excl_tax=self.charge_excl_tax, currency="CHF")


class Express(CustomFixedPrice):
    code = 'express'
    name = _('Express shipping')
    charge_excl_tax = D('15.00')

    def __init__(self):
        super().__init__(charge_excl_tax=self.charge_excl_tax, currency="CHF")


def get_shipping_methods(request):
    methods = [Standard(), Express()]
    serialized_methods = []
    for method in methods:
        price = method.calculate(request.basket)
        serialized_methods.append({
            'code': method.code,
            'name': method.name,
            'description': method.description,
            'price': {
                'currency': price.currency,
                'excl_tax': str(price.excl_tax),
                'incl_tax': str(price.incl_tax),
                'tax': str(price.tax),
            },
            'is_discounted': False,
            'discount': 0.0
        })
    return serialized_methods
