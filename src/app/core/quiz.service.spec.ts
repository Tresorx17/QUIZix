import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { STUDENT_USERS, TEACHER_USER } from './auth.service';
import { Quiz } from './models';
import { QuizService, uid } from './quiz.service';

const prof = TEACHER_USER;
const eleve = STUDENT_USERS[0];

function createService(): QuizService {
  TestBed.configureTestingModule({
    providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
  });
  return TestBed.inject(QuizService);
}

function nouveauQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: uid('quiz'),
    title: 'Quiz de test',
    description: 'Description de test',
    teacherId: prof.id,
    status: 'draft',
    questions: [],
    timeLimitSec: 60,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(() => {
    localStorage.clear();
    service = createService();
  });

  it('cree un quiz en brouillon rattache a son enseignant', () => {
    const quiz = nouveauQuiz();

    service.saveQuiz(quiz);

    const enregistre = service.getQuiz(quiz.id);
    expect(enregistre?.status).toBe('draft');
    expect(service.getTeacherQuizzes(prof.id).some((q) => q.id === quiz.id)).toBe(true);
  });

  it('modifie le contenu d un quiz non publie', () => {
    const quiz = nouveauQuiz();
    service.saveQuiz(quiz);

    service.saveQuiz({ ...quiz, title: 'Titre modifie', updatedAt: Date.now() });

    expect(service.getQuiz(quiz.id)?.title).toBe('Titre modifie');
  });

  it('publie puis retire la publication d un quiz', () => {
    expect(service.getQuiz('quiz-inventions')?.status).toBe('draft');

    service.setQuizStatus('quiz-inventions', 'published');
    expect(service.getQuiz('quiz-inventions')?.status).toBe('published');

    service.setQuizStatus('quiz-inventions', 'draft');
    expect(service.getQuiz('quiz-inventions')?.status).toBe('draft');
  });

  it('supprime un quiz et les tentatives associees', () => {
    expect(service.attempts().some((a) => a.quizId === 'quiz-capitals')).toBe(true);

    service.deleteQuiz('quiz-capitals');

    expect(service.getQuiz('quiz-capitals')).toBeUndefined();
    expect(service.attempts().some((a) => a.quizId === 'quiz-capitals')).toBe(false);
    // Les autres quiz ne sont pas affectes.
    expect(service.getQuiz('quiz-cinema')).toBeDefined();
  });

  it('supprime une question sans toucher aux autres', () => {
    const quiz = service.getQuiz('quiz-inventions')!;
    const restantes = quiz.questions.slice(1);

    service.saveQuiz({ ...quiz, questions: restantes, updatedAt: Date.now() });

    const apres = service.getQuiz('quiz-inventions')!;
    expect(apres.questions.length).toBe(1);
    expect(apres.questions.map((q) => q.id)).toEqual(restantes.map((q) => q.id));
  });

  it('calcule les indicateurs du tableau de bord', () => {
    const terminees = service.attempts().filter((a) => a.finishedAt > 0);

    const stats = service.teacherStats(prof.id);

    expect(stats.published).toBe(2);
    expect(stats.drafts).toBe(1);
    expect(stats.attempts).toBe(terminees.length);
    expect(stats.avgScore).toBeCloseTo(terminees.reduce((sum, a) => sum + a.score, 0) / terminees.length, 10);
  });

  it('enregistre la tentative d un eleve dans le stockage', () => {
    const tentative = service.startAttempt('quiz-capitals', eleve)!;

    expect(tentative.quizId).toBe('quiz-capitals');
    expect(tentative.studentId).toBe(eleve.id);
    expect(tentative.finishedAt).toBe(0);
    expect(service.getAttemptById(tentative.id)).toBeDefined();
  });
});
