# Configuration Bob pour NoteFlow

Ce dossier contient les fichiers de configuration pour l'assistant Bob.

## 📁 Fichiers

### `config.json`
Configuration principale de Bob pour ce projet.

## ⚙️ Auto-Approbation des Commandes

### Commandes Auto-Approuvées ✅

Les commandes suivantes sont automatiquement approuvées par Bob :

- ✅ **Toutes les commandes `php artisan`** (pattern général)
- ✅ `php artisan migrate` - Migrations de base de données
- ✅ `php artisan db:seed` - Seeding de la base de données
- ✅ `php artisan make:*` - Génération de fichiers (models, controllers, etc.)
- ✅ `php artisan serve` - Démarrage du serveur de développement
- ✅ `php artisan config:*` - Gestion de la configuration
- ✅ `php artisan cache:*` - Gestion du cache
- ✅ `php artisan route:*` - Gestion des routes
- ✅ `php artisan view:*` - Gestion des vues
- ✅ `php artisan optimize` - Optimisation de l'application

### Commandes Exclues ⛔

Ces commandes nécessitent toujours une approbation manuelle pour des raisons de sécurité :

- ⛔ `php artisan down` - Mise en maintenance
- ⛔ `php artisan migrate:fresh --force` - Réinitialisation complète de la DB
- ⛔ `php artisan db:wipe` - Suppression de toutes les tables

### Commandes Désactivées par Défaut 🔒

Ces commandes peuvent être activées en modifiant `config.json` :

- 🔒 `composer *` - Commandes Composer (désactivé par défaut)
- 🔒 `npm *` - Commandes NPM (désactivé par défaut)

## 🔧 Personnalisation

Pour modifier les règles d'auto-approbation, éditez le fichier [`config.json`](.roo/config.json:1) :

### Activer une commande désactivée

Changez `"enabled": false` en `"enabled": true` :

```json
{
  "pattern": "^composer.*",
  "description": "Auto-approve composer commands",
  "enabled": true  // ← Changez ici
}
```

### Ajouter une nouvelle règle

Ajoutez un nouvel objet dans le tableau `commands` :

```json
{
  "pattern": "^votre-commande.*",
  "description": "Description de votre commande",
  "enabled": true
}
```

### Exclure une commande spécifique

Ajoutez le pattern dans `excludePatterns` :

```json
"excludePatterns": [
  "^php artisan down.*",
  "^votre-pattern-a-exclure.*"
]
```

## 📝 Format des Patterns

Les patterns utilisent les expressions régulières (regex) :

- `^` - Début de la commande
- `.*` - N'importe quel caractère, n'importe quel nombre de fois
- `$` - Fin de la commande

### Exemples

- `^php artisan migrate$` - Exactement "php artisan migrate"
- `^php artisan migrate.*` - Commence par "php artisan migrate"
- `^php artisan (migrate|seed).*` - Commence par "php artisan migrate" OU "php artisan seed"

## 🚀 Utilisation

Une fois configuré, Bob approuvera automatiquement les commandes correspondantes sans demander de confirmation.

### Exemple

Avant (avec confirmation) :
```
Bob: Je vais exécuter `php artisan migrate`
Vous: [Approuver] [Rejeter]
```

Après (auto-approuvé) :
```
Bob: J'exécute `php artisan migrate` (auto-approuvé)
✓ Migration completed successfully
```

## ⚠️ Sécurité

- Les commandes destructives restent toujours en approbation manuelle
- Vous pouvez désactiver l'auto-approbation en changeant `"enabled": false` dans `autoApprovalSettings`
- Vérifiez régulièrement les commandes exécutées dans l'historique

## 🔄 Rechargement

Après modification de `config.json`, rechargez la fenêtre VS Code pour appliquer les changements :

1. Ouvrez la palette de commandes (`Ctrl+Shift+P` ou `Cmd+Shift+P`)
2. Tapez "Reload Window"
3. Appuyez sur Entrée

---

**Projet:** NoteFlow - Application de pratique musicale interactive  
**Framework:** Laravel 11  
**Langue:** Français
