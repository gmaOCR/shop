#!/bin/bash

# Se placer à la racine du projet
cd "$(dirname "$0")"/..

echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"

export PYTHONPATH=$PYTHONPATH:$(pwd)

# Start Celery worker
pipenv run celery -A backend.celery_app worker -B -l info