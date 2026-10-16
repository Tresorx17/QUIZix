// ---------------------------------------------------------------------------
// Domain models for QUIZix
// ---------------------------------------------------------------------------

export type Role = 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  displayName: string;
  // Mot de passe en clair : démo front-end uniquement, aucune sécurité réelle.
  password: string;
  role: Role;
}

export type Difficulty = 1 | 2 | 3;

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
}

export type QuizStatus = 'draft' | 'published';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  status: QuizStatus;
  questions: Question[];
  /** Durée maximale d'une tentative, en secondes. */
  timeLimitSec: number;
  createdAt: number;
  updatedAt: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  /** questionId -> index de la bonne réponse choisie (ou -1 si non répondue). */
  answers: Record<string, number>;
  /** Score brut : bonnes réponses / questions totales (0..1). */
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSec: number;
  finishedAt: number;
}

export interface StudentScore {
  studentId: string;
  studentName: string;
  attempts: number;
  /** Moyenne des scores d'essai (0..1). */
  avgScore: number;
}
