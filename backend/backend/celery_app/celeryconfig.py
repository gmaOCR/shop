

CELERY_BROKER_URL = 'amqp://localhost'
timezone = "Europe/Berlin"
result_backend = 'django-db'
accept_content = ['application/json']
task_serializer = 'json'
result_serializer = 'json'
broker_connection_retry_on_startup = True
