# My_Event

My_Event est une application web complète permettant aux utilisateurs de découvrir des événements publics, organiser des sorties autour de ces événements et se connecter via Google pour une expérience personnalisée.

## Structure du projet

Le projet est divisé en deux parties principales :

- **Client** : Une application Angular pour l'interface utilisateur.
- **Server** : Une API Node.js/Express pour gérer les données et la logique métier.

## Fonctionnalités principales

### Côté Client (Angular)

- **Découverte d'événements** :
  - Parcourir une liste d'événements publics.
  - Filtrer les événements par localisation, âge, pays, et date.
  - Afficher les détails d'un événement spécifique.
- **Organisation de sorties (Hangouts)** :

  - Créer des sorties autour d'un événement.
  - Inviter d'autres utilisateurs à rejoindre les sorties.
  - Voir les sorties dans une liste dédiée.

- **Connexion via Google** :

  - Connexion à l'application avec un compte Google pour une expérience personnalisée.

- **Interface utilisateur moderne** :
  - Utilisation de **Tailwind CSS** pour un design réactif et moderne.
  - Intégration de **Leaflet** pour afficher des cartes interactives.

### Côté Serveur (Node.js/Express)

- **Gestion des utilisateurs** :

  - Enregistrement des utilisateurs dans une base de données **MongoDB**.
  - Connexions Google gérées via **OAuth2**.

- **Gestion des événements** :

  - Récupération des événements depuis une **API publique** (OpenAgenda).
  - Filtrage et pagination des événements pour une meilleure expérience utilisateur.

- **Gestion des sorties (Hangouts)** :

  - Création de sorties, ajout de participants, et consultation des détails associés.

- **Sécurité et sessions** :
  - Gestion des sessions utilisateur avec **express-session**.
  - Protection des données sensibles avec des **variables d'environnement**.

## Technologies utilisées

### Frontend (Client)

- **Framework** : Angular 18
- **CSS** : Tailwind CSS
- **Cartes** : Leaflet
- **Authentification** : Google OAuth2
- **Tests** : Karma et Jasmine

### Backend (Server)

- **Framework** : Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : Google OAuth2 via google-auth-library
- **API externe** : OpenAgenda pour les événements publics

## Comment exécuter le projet

### Côté Client

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Configurez les variables d'environnement dans le fichier `src/environments/environment.ts` :
   ```typescript
   // ./client/src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3001',
     googleClientId: 'your_google_client_id'
   };
   ```
3. Lancez le serveur de développement Angular :
   ```bash
   ng serve
   ```
4. Accédez à l'application sur [`http://localhost:4200`](http://localhost:4200).

### Côté Serveur

1. Accédez au dossier `server` :
   ```bash
   cd server
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` dans le dossier `server` et configurez les variables suivantes :
   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/my_event
   SESSION_SECRET=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
   ```
4. Lancez le serveur :
   ```bash
   npm start
   ```

## Variables d'environnement

### Backend (`.env`)
| Variable               | Description                                      |
|------------------------|--------------------------------------------------|
| `PORT`                | Port sur lequel le serveur écoute (par défaut : 3001). |
| `MONGO_URI`           | URI de connexion à la base de données MongoDB (par défaut : `mongodb://localhost:27042/my_events`). |
| `SESSION_SECRET`      | Clé secrète pour les sessions utilisateur.       |
| `GOOGLE_TOKEN`        | Token client pour l'authentification Google OAuth2. |

### Frontend (`environment.ts`)
| Variable         | Description                                      |
|------------------|--------------------------------------------------|
| `production`     | Indique si l'environnement est en mode production (`false` par défaut). |
| `apiUrl`         | URL de l'API backend (par défaut : `http://localhost:3001`). |
| `googleToken`    | Token client pour l'authentification Google OAuth2. |

---
