from django.contrib import admin
from .models import Product, Scent, Color


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'price',
                    'image', 'stock', 'length', 'width', 'height',
                    "scent", "color")


class ScentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


class ColorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


admin.site.register(Product, ProductAdmin)
admin.site.register(Scent, ScentAdmin)
admin.site.register(Color, ColorAdmin)
