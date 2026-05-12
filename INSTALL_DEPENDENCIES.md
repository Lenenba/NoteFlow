# Installation des dépendances manquantes

## Packages NPM requis

Pour utiliser les nouvelles fonctionnalités (modes d'instruments et paramètres de jeu), vous devez installer les packages Radix UI suivants :

```bash
npm install @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-collapsible
```

## Si vous rencontrez une erreur PowerShell

Si vous obtenez l'erreur "l'exécution de scripts est désactivée", exécutez cette commande en tant qu'administrateur dans PowerShell :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Puis réessayez l'installation :

```bash
npm install @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-collapsible
```

## Alternative avec pnpm

Si vous utilisez pnpm :

```bash
pnpm add @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-collapsible
```

## Vérification

Après l'installation, vérifiez que les packages sont bien installés :

```bash
npm list @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-collapsible
```

Les nouvelles fonctionnalités incluent :
- ✅ Sélection du mode d'instrument (Piano, Guitar, Drums, Bass)
- ✅ Choix de la direction de défilement (Vertical/Horizontal)
- ✅ Ajustement de la vitesse de défilement
- ✅ Options d'affichage personnalisables
