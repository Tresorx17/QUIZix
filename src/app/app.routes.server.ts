import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Configuration SSR, route par route.
 *
 * `login` et `catalog` sont rendus **côté serveur** : leur contenu ne dépend pas
 * de la session (formulaire de connexion, liste des quiz publiés issue des
 * données de départ), le HTML part donc déjà rempli.
 *
 * Les autres routes restent rendues côté client : elles dépendent de la session
 * et du contenu du navigateur (`localStorage`). Un serveur ne connaît ni la
 * session ni ces données, il émettrait donc de fausses redirections vers
 * `/login` au rafraîchissement, ou afficherait un classement incomplet.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Server },
  { path: 'catalog', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Client },
];
