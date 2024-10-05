from celery.schedules import crontab

CELERY_BROKER_URL = 'amqp://localhost'
timezone = "Europe/Berlin"
result_backend = 'django-db'
accept_content = ['application/json']
task_serializer = 'json'
result_serializer = 'json'
broker_connection_retry_on_startup = True


beat_schedule = {
    'delete-expired-carts': {
        'task': 'cart.tasks.delete_expired_carts',
        'schedule': crontab(minute='*'),  # run every min
    }
}


# CELERY_BEAT_SCHEDULE = {
#     'delete-expired-carts': {
#         'task': 'cart.tasks.delete_expired_carts',
#         'schedule': '*/1 * * * *',  # run every min
#     }
# }
