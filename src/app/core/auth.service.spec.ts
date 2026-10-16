import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

const SESSION_KEY = 'quizix:session';
const USERS_KEY = 'quizix:users';

function createAuthService(): AuthService {
  TestBed.configureTestingModule({
    providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
  });
  return TestBed.inject(AuthService);
}

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());

  it('inscrit un eleve et ouvre sa session', () => {
    const auth = createAuthService();

    const user = auth.register('nouveau', 'motdepasse');

    expect(user).not.toBeNull();
    expect(user!.role).toBe('student');
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.currentUser()?.username).toBe('nouveau');
  });

  it('refuse une inscription invalide ou un identifiant deja pris', () => {
    const auth = createAuthService();

    expect(auth.register('ab', 'motdepasse')).toBeNull();
    expect(auth.register('valide', 'court')).toBeNull();
    expect(auth.register('eleve', 'motdepasse')).toBeNull();
    expect(auth.currentUser()).toBeNull();
  });

  it('connecte un compte existant et refuse des identifiants incorrects', () => {
    const auth = createAuthService();

    expect(auth.login('inconnu', 'quizix')).toBeNull();
    expect(auth.login('professeur', 'mauvais')).toBeNull();
    expect(auth.currentUser()).toBeNull();

    const user = auth.login('eleve', 'quizix');

    expect(user?.id).toBe('u-eleve');
    expect(auth.isLoggedIn()).toBe(true);
  });

  it('attribue les droits selon le role', () => {
    const auth = createAuthService();

    auth.login('professeur', 'quizix');
    expect(auth.isTeacher()).toBe(true);

    auth.logout();
    auth.login('marie', 'quizix');
    expect(auth.isTeacher()).toBe(false);
  });

  it('termine la session a la deconnexion', () => {
    const auth = createAuthService();
    auth.login('eleve', 'quizix');

    auth.logout();

    expect(auth.currentUser()).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('conserve la session et les comptes apres un rechargement de page', () => {
    const auth = createAuthService();
    auth.register('persistant', 'motdepasse');

    // Nouvelle instance de service : equivalent d'un rechargement du navigateur.
    TestBed.resetTestingModule();
    const apres = createAuthService();

    expect(apres.currentUser()?.username).toBe('persistant');
    expect(apres.login('persistant', 'motdepasse')).not.toBeNull();
    expect(localStorage.getItem(USERS_KEY)).toContain('persistant');
  });
});
