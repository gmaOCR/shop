from oscar.apps.shipping import repository
from . import methods


class Repository(repository.Repository):
    methods = (methods.Standard(), methods.Express(), methods.Slow())

    def get_shipping_methods(self, basket, shipping_addr=None, **kwargs):
        """
        Return a list of all applicable shipping method instances for a given
        basket, address etc. This method is intended to be overridden.
        """

        methods = self.get_available_shipping_methods(
            basket=basket, shipping_addr=shipping_addr, **kwargs
        )
        if basket.has_shipping_discounts:
            methods = self.apply_shipping_offers(basket, methods)
        # import pdb
        # pdb.set_trace()
        return self.methods
