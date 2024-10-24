from oscar.apps.shipping import repository
from oscar.core.loading import get_class


Standard = get_class('shipping.methods', 'Standard')
Express = get_class('shipping.methods', 'Express')


class Repository(repository.Repository):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.methods = (Standard(), Express())
