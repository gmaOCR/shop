from django.db import models


class Scent(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Color(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    stock = models.PositiveIntegerField(default=0)

    length = models.DecimalField(max_digits=5, decimal_places=2)  
    width = models.DecimalField(max_digits=5, decimal_places=2)   
    height = models.DecimalField(max_digits=5, decimal_places=2)  

    scent = models.ForeignKey(Scent, on_delete=models.SET_NULL, null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True)


    def __str__(self):
        return self.name



