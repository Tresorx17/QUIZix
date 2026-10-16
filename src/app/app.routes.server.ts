import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Configuration SSR : les routes sont rendues côté client.
 *
 * Les pages affichent des données de démonstration et du contenu
 * utilisateur (session, quiz, timer) qui vivent en localStorage côté
 * navigateur. Les routes dynamiques ne seraient pas prérendables, et le
 * rendu serveur ne serait pas utile : on rend côté client partout.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Client },
];
