# Generated by Django 5.1.1 on 2024-10-05 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0007_alter_cart_session_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='session_id',
            field=models.UUIDField(editable=False, unique=True),
        ),
    ]