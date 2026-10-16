/**
 * Point d'entree serverless Vercel pour QUIZix.
 *
 * Vercel ne branche pas automatiquement le serveur Angular SSR : ce fichier
 * fait le lien. Il re-exporte le `reqHandler` produit par le build
 * (`dist/QUIZix/server/server.mjs`, genere depuis `src/server.ts`), qui est un
 * ecouteur HTTP Node complet : rendu Angular + fichiers statiques + routes.
 *
 * Le build doit etre lance avant (buildCommand `npm run build`), et
 * `vercel.json` inclut `dist/QUIZix/**` dans le bundle de la fonction.
 */
const { reqHandler } = await import('../dist/QUIZix/server/server.mjs');

export default reqHandler;
