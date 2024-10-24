# Django-React Boilerplate

## Description

Ce projet est exemple de webshopping utilisant le celèbre API Oscar Commerce en DRF couplé à un front-end indépendant en ReactJS.
Il en cours d'élaboration et est updaté régulièrement

## Prérequis

Avant de commencer, assurez-vous que vous avez installé les outils suivants :

- [Python](https://www.python.org/) (version 3.x)
- [pipenv](https://pipenv.pypa.io/en/latest/)

## Installation et Configuration

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/gmaOCR/shop.git
   ```

2. **Naviguer dans le répertoire du projet backend:**

   ```bash
   cd backend/
   ```

3. **Installer les dépendances Python :**

   ```bash
   pipenv install
   ```

4. **Installer les dépendances Node :**

   ```bash
   (cd ..)
   cd frontend
   npm install
   ```

5. **Lancer les serveurs Django et Vite :**

   Depuis le répertoire backend

   ```bash
   pipenv run python start.py
   ```

   Depuis le répertoire frontend

   ```bash
   npm run dev
   ```

## Accès aux Serveurs

- **React (Vite) :** Accédez à l'application React à l'adresse suivante : [http://localhost:5173/](http://localhost:5173/)

- **Django API REST :** Accédez à l'API Django à l'adresse suivante : [http://localhost:8000/api/](http://localhost:8000/api/)

## Licence

Ce projet est sous licence [MIT](LICENSE).
