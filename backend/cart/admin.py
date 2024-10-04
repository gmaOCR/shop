from django.contrib import admin
from .models import Cart


class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'updated_at',
                    'session_id')


admin.site.register(Cart, CartAdmin)
