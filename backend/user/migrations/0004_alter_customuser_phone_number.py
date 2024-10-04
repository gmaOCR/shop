# Generated by Django 5.1.1 on 2024-10-03 15:21

import phonenumber_field.modelfields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_customuser_groups_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='phone_number',
            field=phonenumber_field.modelfields.PhoneNumberField(default='0123456789', max_length=128, region='FR'),
            preserve_default=False,
        ),
    ]
