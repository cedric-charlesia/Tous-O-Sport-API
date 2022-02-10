# Tous O Sport API v.1.0
Tous O Sport est une API gérant la mise en relation de coachs et de pratiquants cherchant du coaching de groupe !

L'API Tous O Sport a été développée avec :
- Node.js et le framework Express
- PostgreSQL pour la conception de la base de données

## Lancer le projet en production
**`npm start`** dans le répertoire à la racine du projet

## Lancer le projet en développement
**`npm run dev`** dans le répertoire à la racine du projet

## Installer la base de données
La base de données est versionnée avec l'outil [Sqitch](https://sqitch.org/).
- Pour la déployer, après configuration de Sqitch :
**`sqitch deploy`**
- Pour revenir en arrière :
**`sqitch revert`**
- Pour vérifier que les requêtes SQL fonctionne bien :
**`sqitch verify`**
- Pour ajouter une nouvelle migration :
**`sqitch add nom-de-la-migration`**

## Les fonctionnalités
L'API permet :
- La récupération des catégories de sports en base de données
- L'inscription et la connexion des coachs et des utilisateurs
- La possibilité pour les coachs et utilisateurs de modifier et/ou supprimer leur profil
- La possibilité pour les coachs de proposer des séances de sport

## Pour en savoir plus
Pour tester les fonctionnalités, [l'API est disponible sur Heroku](https://tous-o-sport-api.herokuapp.com/docs/)

