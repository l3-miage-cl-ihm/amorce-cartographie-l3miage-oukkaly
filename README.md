# AmorceCartographie

Les dépendances sont déjà installé, mais à titre informatif, voici ce qu'il faut faire pour installer les leaflet dans un projet Angular (tiré de [https://www.npmjs.com/package/@asymmetrik/ngx-leaflet](https://www.npmjs.com/package/@asymmetrik/ngx-leaflet)) :

* Installer les bibliothèques Leaflet et ngx-leaflet :

    ```bash
    npm install --save     leaflet @asymmetrik/ngx-leaflet
    npm install --save-dev @types/leaflet
    ```

* Ajouter les fichiers CSS de Leaflet dans le fichier `angular.json` :

  ```json
  ...
  "styles": [
    "styles.css",
    "./node_modules/leaflet/dist/leaflet.css"
  ],
  ...
  ```

* Ajoutez les assets de Leaflet dans le fichier `angular.json` :

  ```json
  ...
  "assets": [
    ...,
    {
        "glob": "**/*",
        "input": "./node_modules/leaflet/dist/images",
        "output": "assets/"
    }
  ],
  ...
  ```

* Dans votre projet Angular, importer le module `LeafletModule` :

  * Pour Angular jusqu'à la version 16, ajouter le module dans le fichier `app.module.ts` :

    ```typescript
    import { LeafletModule } from '@asymmetrik/ngx-leaflet';

    @NgModule({
        imports: [
            LeafletModule
        ]
    })
    ```

  * Pour Angular 17 et plus, il faudra importer le module dans les composants qui l'utilisent (par exemple le module racine).

* Instanciez un carte dans une balise div, en ajoutant un attribut `leaflet`. Attention, il est nécessaire de fixer au moins la hauteur de la balise avec du CSS, sinon elle aura une hauteur de 0.

  ```html
  <!-- Directement dans la balise, ou plus proprement dans une feuille de style -->
  <div leaflet style="height: 400px;"></div>
  ```
