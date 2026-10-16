import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { User } from './models';

const SESSION_KEY = 'quizix:session';
const USERS_KEY = 'quizix:users';

export const TEACHER_USER: User = {
  id: 'u-prof',
  username: 'professeur',
  displayName: 'Professeur',
  password: 'quizix',
  role: 'teacher',
};

export const STUDENT_USERS: User[] = [
  { id: 'u-eleve', username: 'eleve', displayName: 'Eleve', password: 'quizix', role: 'student' },
  { id: 'u-marie', username: 'marie', displayName: 'Marie', password: 'quizix', role: 'student' },
  { id: 'u-paul', username: 'paul', displayName: 'Paul', password: 'quizix', role: 'student' },
];

function readJson<T>(key: string, fallback: T, platformId: object): T {
  if (!isPlatformBrowser(platformId)) {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw as string) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown, platformId: object): void {
  if (!isPlatformBrowser(platformId)) {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function removeKey(key: string, platformId: object): void {
  if (!isPlatformBrowser(platformId)) {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentUser = signal<User | null>(null);
  readonly users = signal<User[]>([]);

  /** Indique si un utilisateur est connecté. */
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  /** Indique si l'utilisateur connecté est un enseignant. */
  readonly isTeacher = computed(() => this.currentUser()?.role === 'teacher');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const users = readJson<User[]>(USERS_KEY, [TEACHER_USER, ...STUDENT_USERS], this.platformId);
      this.users.set(users);
      const sessionId = readJson<string | null>(SESSION_KEY, null, this.platformId);
      if (sessionId) {
        const found = users.find((u) => u.id === sessionId) ?? null;
        if (found) {
          this.currentUser.set(found);
        }
      }
    }
  }

  login(username: string, password: string): User | null {
    const found = this.users().find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
    );
    if (found && found.password === password) {
      this.currentUser.set(found);
      if (isPlatformBrowser(this.platformId)) {
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify(found.id));
        } catch {
          // ignore
        }
      }
      return found;
    }
    return null;
  }

  /** Crée un compte élève (simulation front-end, usage démonstration). */
  register(username: string, password: string): User | null {
    const name = username.trim().toLowerCase();
    if (name.length < 3 || password.length < 6) {
      return null;
    }
    const users = this.users();
    if (users.some((u) => u.username === name)) {
      return null;
    }
    const user: User = {
      id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      username: name,
      displayName: name,
      password,
      role: 'student',
    };
    const next = [...users, user];
    this.users.set(next);
    this.currentUser.set(user);
    writeJson(USERS_KEY, next, this.platformId);
    writeJson(SESSION_KEY, user.id, this.platformId);
    return user;
  }

  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {
        // ignore
      }
    }
  }
}
