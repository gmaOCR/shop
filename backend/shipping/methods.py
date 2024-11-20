from oscar.apps.shipping import methods
from oscar.core import prices
from decimal import Decimal as D


class Standard(methods.Base):
    code = 'standard'
    name = 'Standard shipping'

    def calculate(self, basket):
        return prices.Price(
            currency=basket.currency,
            excl_tax=D('7.50'), incl_tax=D('7.50'))


class Express(methods.FixedPrice):
    code = 'express'
    name = 'Express shipping'

    def calculate(self, basket):
        return prices.Price(
            currency=basket.currency,
            excl_tax=D('15.00'), incl_tax=D('15.00'))


class Slow(methods.FixedPrice):
    code = 'slow'
    name = 'Slow shipping'

    def calculate(self, basket):
        return prices.Price(
            currency=basket.currency,
            excl_tax=D('3.00'), incl_tax=D('3.00'))
