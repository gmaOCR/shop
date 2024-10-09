#!/bin/bash

# Se placer à la racine du projet
cd "$(dirname "$0")"/..

echo "Current directory: $(pwd)"
export PYTHONPATH=$PYTHONPATH:$(pwd)
echo "Python path: $PYTHONPATH"


# Start Celery worker
#pipenv run celery -A backend.celery_app worker -B -l debug
pipenv run celery -A backend.celery_app worker -B -l info