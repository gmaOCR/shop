# Generated by Django 5.1.1 on 2024-10-05 11:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0005_alter_cart_session_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='session_id',
            field=models.UUIDField(default='<function uuid4 at 0x7f3963587100>', editable=False, unique=True),
        ),
    ]