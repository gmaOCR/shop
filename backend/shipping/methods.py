from oscar.apps.shipping import methods
from oscar.core import prices
from decimal import Decimal as D


class Standard(methods.FixedPrice):
    code = 'standard'
    name = 'Standard shipping'
    charge_excl_tax = D('7.00')


class Express(methods.FixedPrice):
    code = 'express'
    name = 'Express shipping'
    charge_excl_tax = D('15.00')
