import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Quiz, QuizAttempt, StudentScore, User } from './models';

const QUIZZES_KEY = 'quizix:quizzes';
const ATTEMPTS_KEY = 'quizix:attempts';

let uidCounter = 0;
export function uid(prefix = 'id'): string {
  uidCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${uidCounter.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function readJson<T>(key: string, fallback: T, platformId: object): T {
  if (!isPlatformBrowser(platformId)) {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
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
    // Le stockage peut être indisponible : on ignore.
  }
}

function daysAgo(n: number): number {
  return Date.now() - n * 24 * 60 * 60 * 1000;
}

function buildSeedQuizzes(): Quiz[] {
  const now = Date.now();
  return [
    {
      id: 'quiz-capitals',
      title: 'Les capitales du monde',
      description: 'Test rapide de culture générale : capitales de pays célèbres.',
      teacherId: 'u-prof',
      status: 'published',
      timeLimitSec: 120,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
      questions: [
        {
          id: 'q-cap-1',
          text: 'Quelle est la capitale de la France ?',
          options: ['Lyon', 'Marseille', 'Paris', 'Nice'],
          correctIndex: 2,
          explanation: 'Paris est la capitale de la France depuis 1871.',
          difficulty: 1,
        },
        {
          id: 'q-cap-2',
          text: 'Quelle est la capitale du Japon ?',
          options: ['Osaka', 'Séoul', 'Kyoto', 'Tokyo'],
          correctIndex: 3,
          explanation: 'Tokyo est la capitale et la plus grande ville du Japon.',
          difficulty: 2,
        },
        {
          id: 'q-cap-3',
          text: 'Quelle est la capitale de l’Australie ?',
          options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
          correctIndex: 2,
          explanation: 'Canberra est la capitale de l’Australie.',
          difficulty: 2,
        },
        {
          id: 'q-cap-4',
          text: 'Quelle est la capitale du Canada ?',
          options: ['Toronto', 'Vancouver', 'Montréal', 'Ottawa'],
          correctIndex: 3,
          explanation: 'Ottawa est la capitale du Canada.',
          difficulty: 3,
        },
      ],
    },
    {
      id: 'quiz-cinema',
      title: 'Culture cinéma',
      description: 'Histoire et techniques du cinéma : assez pour éprouver les vrais cinéphiles.',
      teacherId: 'u-prof',
      status: 'published',
      timeLimitSec: 150,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
      questions: [
        {
          id: 'q-cin-1',
          text: 'En quelle année le premier film « Jurassic Park » est sorti ?',
          options: ['1992', '1993', '1994', '1995'],
          correctIndex: 1,
          explanation: 'Le film est sorti en juin 1993.',
          difficulty: 1,
        },
        {
          id: 'q-cin-2',
          text: 'Quel acteur a interprété le Joker dans « The Dark Knight » ?',
          options: ['Jared Leto', 'Heath Ledger', 'Joaquin Phoenix', 'Jack Nicholson'],
          correctIndex: 1,
          explanation: 'Heath Ledger a porté le rôle du Joker en 2008.',
          difficulty: 2,
        },
        {
          id: 'q-cin-3',
          text: 'Quel genre de caméra a été popularisé par « Citizen Kane » ?',
          options: ['Numérique', '16 mm', 'Grand format', 'Télévision'],
          correctIndex: 2,
          explanation: 'Le film muet de 1941 a popularisé le grand format 35 mm.',
          difficulty: 3,
        },
      ],
    },
    {
      id: 'quiz-inventions',
      title: 'Les inventions qui ont changé le monde',
      description: 'Brouillon de démo : à publier avant la démonstration.',
      teacherId: 'u-prof',
      status: 'draft',
      timeLimitSec: 180,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
      questions: [
        {
          id: 'q-inv-1',
          text: 'Quelle invention permet l’alimentation électrique des foyers ?',
          options: ['L’électricité elle-même', 'L’ampoule', 'Le moteur électrique', 'Le transformateur'],
          correctIndex: 1,
          explanation: 'L’ampoule d’Edison a permis l’usage général de l’électricité.',
          difficulty: 1,
        },
        {
          id: 'q-inv-2',
          text: 'Quelle invention a permis la transmission du son en continu ?',
          options: ['Le phonographe', 'Le poste à transistors', 'Le haut-parleur', 'Le Bluetooth'],
          correctIndex: 2,
          explanation: 'Le haut-parleur a rendu la musique amplifiée possible.',
          difficulty: 2,
        },
      ],
    },
  ];
}

function buildSeedAttempts(): QuizAttempt[] {
  return [
    {
      id: 'att-1',
      quizId: 'quiz-capitals',
      studentId: 'u-eleve',
      studentName: 'Élève',
      answers: { 'q-cap-1': 2, 'q-cap-2': 3, 'q-cap-3': 2 },
      score: 2 / 3,
      correctCount: 2,
      totalQuestions: 3,
      durationSec: 74,
      finishedAt: daysAgo(1),
    },
    {
      id: 'att-2',
      quizId: 'quiz-capitals',
      studentId: 'u-marie',
      studentName: 'Marie',
      answers: { 'q-cap-1': 2, 'q-cap-2': 3, 'q-cap-3': 2, 'q-cap-4': 3 },
      score: 1,
      correctCount: 4,
      totalQuestions: 4,
      durationSec: 98,
      finishedAt: daysAgo(2),
    },
    {
      id: 'att-3',
      quizId: 'quiz-cinema',
      studentId: 'u-paul',
      studentName: 'Paul',
      answers: { 'q-cin-1': 1, 'q-cin-2': 1 },
      score: 0.5,
      correctCount: 2,
      totalQuestions: 2,
      durationSec: 51,
      finishedAt: daysAgo(3),
    },
  ];
}

/**
 * Service de gestion des quiz, des tentatives et du classement
 * (capacité quiz-management / quiz-taking / leaderboards).
 *
 * Toutes les données sont persistées en localStorage (simulation front-end).
 */
@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly quizzes = signal<Quiz[]>([]);
  readonly attempts = signal<QuizAttempt[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedQuizzes = readJson<Quiz[]>(QUIZZES_KEY, [], this.platformId);
      const storedAttempts = readJson<QuizAttempt[]>(ATTEMPTS_KEY, [], this.platformId);
      if (storedQuizzes.length === 0 && storedAttempts.length === 0) {
        const quizzes = buildSeedQuizzes();
        const attempts = buildSeedAttempts();
        writeJson(QUIZZES_KEY, quizzes, this.platformId);
        writeJson(ATTEMPTS_KEY, attempts, this.platformId);
        this.quizzes.set(quizzes);
        this.attempts.set(attempts);
      } else {
        this.quizzes.set(storedQuizzes);
        this.attempts.set(storedAttempts);
      }
    }
  }

  getQuiz(id: string): Quiz | undefined {
    return this.quizzes().find((q) => q.id === id);
  }

  getAttemptById(id: string): QuizAttempt | undefined {
    return this.attempts().find((a) => a.id === id);
  }

  getTeacherQuizzes(teacherId: string): Quiz[] {
    return this.quizzes()
      .filter((q) => q.teacherId === teacherId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  saveQuiz(quiz: Quiz): void {
    const quizzes = this.quizzes();
    const idx = quizzes.findIndex((q) => q.id === quiz.id);
    const next = idx >= 0 ? quizzes.map((q) => (q.id === quiz.id ? quiz : q)) : [quiz, ...quizzes];
    this.quizzes.set(next);
    writeJson(QUIZZES_KEY, next, this.platformId);
  }

  deleteQuiz(id: string): void {
    const next = this.quizzes().filter((q) => q.id !== id);
    this.quizzes.set(next);
    writeJson(QUIZZES_KEY, next, this.platformId);
    const nextAttempts = this.attempts().filter((a) => a.quizId !== id);
    this.attempts.set(nextAttempts);
    writeJson(ATTEMPTS_KEY, nextAttempts, this.platformId);
  }

  /** Publie (true) ou retire la publication (false) d'un quiz. */
  setQuizStatus(id: string, status: 'draft' | 'published'): void {
    const next = this.quizzes().map((q) => (q.id === id ? { ...q, status, updatedAt: Date.now() } : q));
    this.quizzes.set(next);
    writeJson(QUIZZES_KEY, next, this.platformId);
  }

  /** Crée une tentative (en cours) et retourne l'objet tentative. */
  startAttempt(quizId: string, student: User): QuizAttempt | null {
    const quiz = this.getQuiz(quizId);
    if (!quiz) {
      return null;
    }
    const attempt: QuizAttempt = {
      id: uid('att'),
      quizId,
      studentId: student.id,
      studentName: student.displayName,
      answers: {},
      score: 0,
      correctCount: 0,
      totalQuestions: quiz.questions.length,
      durationSec: 0,
      finishedAt: 0,
    };
    // Une tentative non terminée du même élève sur le même quiz est remplacée :
    // elle ne doit ni s'accumuler, ni peser dans le classement.
    const others = this.attempts().filter(
      (a) => !(a.studentId === student.id && a.quizId === quizId && a.finishedAt === 0),
    );
    const attempts = [attempt, ...others];
    this.attempts.set(attempts);
    writeJson(ATTEMPTS_KEY, attempts, this.platformId);
    return attempt;
  }

  /** Enregistre la tentative finalisée. */
  saveAttempt(attempt: QuizAttempt): void {
    const attempts = this.attempts().map((a) => (a.id === attempt.id ? attempt : a));
    this.attempts.set(attempts);
    writeJson(ATTEMPTS_KEY, attempts, this.platformId);
  }

  /** Classement des élèves par score moyen (0..1), du meilleur au plus bas. */
  leaderboard(): StudentScore[] {
    const attemptsByStudent = new Map<string, QuizAttempt[]>();
    for (const a of this.attempts()) {
      if (a.finishedAt <= 0) {
        // Tentative en cours ou abandonnée : elle ne participe pas au classement.
        continue;
      }
      const list = attemptsByStudent.get(a.studentId) ?? [];
      list.push(a);
      attemptsByStudent.set(a.studentId, list);
    }
    const scores: StudentScore[] = [];
    for (const [studentId, list] of attemptsByStudent) {
      const avg =
        list.reduce((acc, a) => acc + a.score, 0) / Math.max(1, list.length);
      const last = list[list.length - 1];
      scores.push({
        studentId,
        studentName: last.studentName,
        attempts: list.length,
        avgScore: avg,
      });
    }
    return scores.sort((a, b) => b.avgScore - a.avgScore || a.studentName.localeCompare(b.studentName));
  }

  /** Statistiques globales pour le tableau de bord enseignant. */
  teacherStats(teacherId: string): { published: number; drafts: number; attempts: number; avgScore: number } {
    const quizzes = this.getTeacherQuizzes(teacherId);
    // Seules les tentatives terminées comptent (cohérent avec le classement).
    const attempts = this.attempts().filter((a) => a.finishedAt > 0);
    const published = quizzes.filter((q) => q.status === 'published').length;
    const drafts = quizzes.filter((q) => q.status === 'draft').length;
    const avgScore = attempts.length
      ? attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length
      : 0;
    return { published, drafts, attempts: attempts.length, avgScore };
  }
}
