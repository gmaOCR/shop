#!/bin/bash

# Se placer à la racine du projet
cd "$(dirname "$0")"/..

# Run test
pipenv run pytest --cov=. --nomigrations

pipenv run coverage html -d coverage/coverage_html_api --include=api/* 
pipenv run coverage html -d coverage/coverage_html_cart --include=cart/* 
pipenv run coverage html -d coverage/coverage_html_order --include=order/* 
pipenv run coverage html -d coverage/coverage_html_product --include=product/*
pipenv run coverage html -d coverage/coverage_html_user --include=user/* 