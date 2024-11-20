#!/bin/bash

# Se placer à la racine du projet
cd "$(dirname "$0")"/..
echo "Current directory: $(pwd)"
export PYTHONPATH=$PYTHONPATH:$(pwd)
echo "Python path: $PYTHONPATH"


# Start django API server
pipenv run python manage.py runserver