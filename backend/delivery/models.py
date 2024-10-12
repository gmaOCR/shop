from django.db import models
from user.models import CustomUser


class Order(models.Model):
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"


class Bill(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='bills/')
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Bill #{self.id} for Order #{self.order.id}"


class Shipment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    company = models.CharField(max_length=255)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    tracking_number = models.CharField(max_length=255)
