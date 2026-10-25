# sur-lecran

Explique comment ajouter une application à l’écran d’accueil, selon le téléphone et le navigateur.

Le paquet fournit les textes en français. Il peut afficher un bandeau, ou te laisser dessiner l’aide toi-même à partir d’un objet.

## Installer

Le paquet n’est pas publié sur le registre npm. Installe-le depuis GitHub :

```bash
npm install github:bobywan/sur-lecran
```

React 19 est requis.

## Afficher le bandeau

```tsx
"use client";

import { HomeScreenBanner } from "sur-lecran";

export function InstallHint() {
  return <HomeScreenBanner appName="Cookezy" />;
}
```

Le bandeau apparaît en bas de l’écran sur iPhone et Android, tant que la page n’est pas déjà ouverte depuis l’icône et tant que la personne ne l’a pas fermé. Sur ordinateur, il reste caché.

`storageKey` change la clé de fermeture (par défaut `sur-lecran:dismissed`). `className` s’ajoute sur le bandeau. `onDismiss` est appelé au clic sur Fermer.

## Utiliser seulement l’objet

```ts
import { getHomeScreenGuide } from "sur-lecran";

const guide = getHomeScreenGuide({ appName: "Cookezy" });

if (guide.shouldExplain) {
  console.log(guide.title, guide.steps);
}
```

L’objet contient `platform`, `browser`, `alreadyOnHomeScreen`, `shouldExplain`, `title`, `intro` et `steps`. Sur le serveur, sans navigateur, `shouldExplain` est faux et `steps` est vide.
