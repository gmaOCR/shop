# Django-React Boilerplate

## Description

Ce projet est un modèle de démarrage pour les applications Django et React, configuré pour le développement local. Pour un déploiement en production, veuillez modifier les fichiers `settings.py` et `vite.config.js`.

## Prérequis

Avant de commencer, assurez-vous que vous avez installé les outils suivants :
- [Python](https://www.python.org/) (version 3.x)
- [pipenv](https://pipenv.pypa.io/en/latest/)

## Installation et Configuration

1. **Cloner le dépôt :**

    ```bash
    git clone https://github.com/gmaOCR/django-react-boiler-plate.git
    ```

2. **Naviguer dans le répertoire du projet :**

    ```bash
    cd django-react-boiler-plate/
    ```

3. **Installer les dépendances Python :**

    ```bash
    pipenv install
    ```

4. **Lancer le script pour démarrer les serveurs Django et Vite :**

    ```bash
    pipenv run python start.py
    ```

    Ce script démarrera les serveurs de développement pour Django et Vite. Assurez-vous que les ports utilisés (8000 pour Django et 5173 pour Vite) sont disponibles.

## Accès aux Serveurs

- **React (Vite) :** Accédez à l'application React à l'adresse suivante : [http://localhost:5173/](http://localhost:5173/)

- **Django API REST :** Accédez à l'API Django à l'adresse suivante : [http://localhost:8000/api/hello/](http://localhost:8000/api/hello/)

## Notes pour la Production

Pour déployer ce projet en production, vous devrez :
- Modifier le fichier `settings.py` de Django pour configurer les paramètres de production (par exemple, les paramètres de base de données, les configurations de sécurité, etc.).
- Mettre à jour le fichier `vite.config.js` pour configurer les options de build et les paramètres du serveur de production.

Assurez-vous également de configurer correctement le serveur web et les outils de gestion de processus pour exécuter Django et Vite en production.

## Contributions

Les contributions sont les bienvenues ! Si vous souhaitez proposer des améliorations ou des corrections, veuillez soumettre une pull request.

## Licence

Ce projet est sous licence [MIT](LICENSE).
