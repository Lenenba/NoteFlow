# 🚀 Guide de démarrage rapide avec Laravel Herd

Ce guide vous aidera à configurer et lancer NoteFlow avec [Laravel Herd](https://herd.laravel.com/), l'environnement de développement Laravel natif.

## 📋 Qu'est-ce que Herd ?

Laravel Herd est un environnement de développement Laravel natif pour macOS et Windows qui inclut :
- ✅ PHP (plusieurs versions disponibles)
- ✅ Nginx (serveur web automatique)
- ✅ Base de données (MySQL, PostgreSQL, Redis)
- ✅ Gestion automatique des domaines `.test`
- ✅ SSL automatique
- ✅ Pas de configuration Docker nécessaire

## 🎯 Installation de Herd

1. **Téléchargez Herd**
   - Visitez [herd.laravel.com](https://herd.laravel.com/)
   - Téléchargez la version pour votre système d'exploitation
   - Installez l'application

2. **Configurez Herd**
   - Lancez Herd depuis votre barre de menu
   - Choisissez votre version PHP (8.3+ recommandé)
   - Définissez votre répertoire de projets (par défaut : `~/Herd`)

## 🎵 Configuration de NoteFlow

### Étape 1 : Cloner le projet

```bash
# Naviguez vers votre répertoire Herd
cd ~/Herd  # ou votre répertoire personnalisé

# Clonez le projet
git clone <repository-url> NoteFlow
cd NoteFlow
```

### Étape 2 : Installer les dépendances

```bash
# Installer les dépendances PHP
composer install

# Installer les dépendances JavaScript
npm install
```

### Étape 3 : Configuration de l'environnement

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

Le fichier `.env` est déjà configuré pour Herd avec :
- `APP_URL=http://noteflow.test`
- `DB_CONNECTION=sqlite` (base de données SQLite par défaut)

### Étape 4 : Initialiser la base de données

```bash
# Créer et peupler la base de données
php artisan migrate:fresh --seed
```

### Étape 5 : Lancer le développement

```bash
# Lancer Vite et la queue (Herd gère déjà le serveur web)
composer dev
```

**Alternative** : Si vous n'utilisez pas Herd, utilisez :
```bash
composer dev:serve
```

### Étape 6 : Accéder à l'application

Ouvrez votre navigateur et visitez :
- **http://noteflow.test** (avec Herd)
- **http://localhost:8000** (sans Herd, avec `composer dev:serve`)

## 🎹 Configuration MIDI

Pour utiliser les fonctionnalités MIDI de NoteFlow :

1. **Connectez votre clavier MIDI** à votre ordinateur
2. **Autorisez l'accès MIDI** dans votre navigateur lorsque demandé
3. **Testez la connexion** en allant sur une page de pratique

## 🔧 Commandes utiles

### Développement avec Herd

```bash
# Lancer le développement (queue + vite)
composer dev

# Lancer uniquement Vite
npm run dev

# Lancer la queue manuellement
php artisan queue:listen --tries=1
```

### Développement sans Herd

```bash
# Lancer tout (serveur + queue + vite)
composer dev:serve

# Ou séparément
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

### Base de données

```bash
# Réinitialiser la base de données
php artisan migrate:fresh --seed

# Créer une nouvelle migration
php artisan make:migration create_table_name

# Lancer les migrations
php artisan migrate
```

### Tests et qualité du code

```bash
# Lancer les tests
php artisan test

# Vérifier le style de code PHP
composer lint:check

# Corriger le style de code PHP
composer lint

# Vérifier le style de code JavaScript
npm run lint:check

# Corriger le style de code JavaScript
npm run lint
```

## 🌐 Gestion des domaines avec Herd

Herd crée automatiquement un domaine `.test` basé sur le nom du dossier :
- Dossier `NoteFlow` → `http://noteflow.test`
- Dossier `my-project` → `http://my-project.test`

### Personnaliser le domaine

Si vous voulez un domaine personnalisé :

1. Ouvrez Herd depuis la barre de menu
2. Cliquez sur "Sites"
3. Trouvez votre projet et cliquez sur "Link"
4. Choisissez un nom personnalisé

## 🔄 Changer de version PHP

Herd permet de changer facilement de version PHP :

1. Ouvrez Herd depuis la barre de menu
2. Cliquez sur "PHP"
3. Sélectionnez la version souhaitée (8.3+ recommandé)
4. Herd redémarre automatiquement avec la nouvelle version

## 🗄️ Utiliser MySQL au lieu de SQLite

Si vous préférez MySQL :

1. **Activez MySQL dans Herd**
   - Ouvrez Herd → Services → Activez MySQL

2. **Créez une base de données**
   ```bash
   # Via Herd UI ou en ligne de commande
   mysql -u root -e "CREATE DATABASE noteflow"
   ```

3. **Mettez à jour `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=noteflow
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Lancez les migrations**
   ```bash
   php artisan migrate:fresh --seed
   ```

## 🐛 Dépannage

### Le site ne charge pas

1. Vérifiez que Herd est en cours d'exécution
2. Vérifiez que le projet est dans le répertoire Herd
3. Essayez de "Unlink" puis "Link" le site dans Herd

### Erreur de base de données

```bash
# Vérifiez que le fichier SQLite existe
ls -la database/database.sqlite

# Si absent, créez-le
touch database/database.sqlite
php artisan migrate:fresh --seed
```

### Erreur de permissions

```bash
# Donnez les permissions nécessaires
chmod -R 755 storage bootstrap/cache
```

### Vite ne se connecte pas

```bash
# Arrêtez Vite et relancez
# Ctrl+C puis
npm run dev
```

## 📚 Ressources

- [Documentation Laravel Herd](https://herd.laravel.com/docs)
- [Documentation Laravel](https://laravel.com/docs)
- [Documentation NoteFlow](../README.md)
- [Guide de contribution](../CONTRIBUTING.md)

## 💡 Conseils

1. **Utilisez Herd Pro** pour des fonctionnalités avancées (bases de données multiples, partage de sites, etc.)
2. **Activez SSL** dans Herd pour tester avec HTTPS
3. **Utilisez les outils de débogage** intégrés à Herd (logs, base de données)
4. **Configurez votre éditeur** pour utiliser la version PHP de Herd

## 🎉 Prêt à coder !

Votre environnement NoteFlow est maintenant configuré avec Herd. Bon développement ! 🎵

Pour toute question, consultez la [documentation complète](../README.md) ou ouvrez une issue sur GitHub.
