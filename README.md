# JustStreamIt — Interface utilisateur

Projet Openclassrooms : P6 Développez une interface utilisateur pour une application web Python

## Présentation du projet

Ce projet est un site web responsive et dynamique consommant une API de films, il permet d'afficher aux utilisateurs :

- Le meilleur film
- Les films les mieux notés toutes catégories confondues
- Les meilleurs films de plusieurs catégories (Mystery, Animation)
- Une catégorie au choix qui peut être sélectionnée via un menu déroulant.

Le site adapte automatiquement son affichage selon la taille de l’écran (ordinateur, tablette, smartphone).  
Il intègre des comportements comme une modale détaillée pour chaque film, un bouton "Voir plus / Voir moins", et une select box personnalisée pour le filtrage des genres (menu déroulant).

## Installaion et Prérequis

### Prérequis

- Pour faire fonctionner ce projet, vous devez récupérer et exécuter l’API disponible à cette adresse :
  https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR - La procédure d'installation de l'API est inclus dans son README.

### Installation

1. Clonez le projet :

    `git clone https://github.com/MagNott/P6_D-veloppez-interface-utilisateur-application-web-Python.git`

2. Lancez le serveur de l’API (suivre les instructions de son README, exemple de commande) :
   `python manage.py runserver`

3. Ouvrez le fichier `index.html` dans votre navigateur.

## Style & CSS

Le style du projet est géré avec Tailwind CSS.
https://tailwindcss.com/docs/installation/tailwind-cli

Cependant, vous n’avez pas besoin d’installer Tailwind :

- Le fichier output.css contient tout le CSS généré avec Tailwind.
- Il est déjà prêt à être utilisé.

## Architecture du projet

P6_D-veloppez-interface-utilisateur-application-web-Python  
├── .gitignore ← Fichier listant les éléments à exclure du dépôt Git (ex : fichiers temporaires, node_modules, etc.)
├── output.css ← Fichier CSS généré (ex : par Tailwind)  
├── images/  
│ └── ... ← Bannières, flèches, icône de croix, etc.  
├── main.js ← Fichier principal : logiques d’affichage, modale, événements  
├── fonctions.js ← Fonctions utilitaires (ex : chargerImage, etc.)  
├── index.html ← Page principale avec les templates et la structure HTML  
├── README.md ← Documentation du projet  
├── package.json ← Fichier de configuration (si gestion de dépendances)  
└── package-lock.json ← Fichier de configuration (si gestion de dépendances)

## Technologies utilisées et qualité de code

- Javascript (Vanilla)
  - Fetch() avec `async/await`
- HTML
  - Utilisation des balises `<template>` pour les composants dynamiques
- Tailwind CSS
  - Responsive design (mobile, tablette, desktop)
- Qualité de code
  - JSDoc et commentaires
  - Respect des recommandations W3C
  - Prettier et ESLint
  - Accessibilité
    - Aria-label et navigation clavier

## Auteur

Projet réalisé par MagNott dans le cadre du parcours développeur d'application Python chez OpenClassrooms.
