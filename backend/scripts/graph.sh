#!/bin/bash

# Se placer à la racine du projet
cd "$(dirname "$0")"/..

echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"

export PYTHONPATH=$PYTHONPATH:$(pwd)

# Start django API server
pipenv run python manage.py graph_models -a -o all_models.png