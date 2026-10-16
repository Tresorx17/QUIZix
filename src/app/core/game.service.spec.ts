import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { STUDENT_USERS } from './auth.service';
import { GameService } from './game.service';
import { QuizService } from './quiz.service';

const eleve = STUDENT_USERS[0];

describe('GameService', () => {
  let quizService: QuizService;
  let game: GameService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    quizService = TestBed.inject(QuizService);
    game = TestBed.inject(GameService);
  });

  it('enregistre les réponses choisies dans la tentative terminée', () => {
    const quiz = quizService.getQuiz('quiz-capitals')!;
    game.start(quiz, eleve);
    for (const question of quiz.questions) {
      game.answer(question.id, question.correctIndex);
    }

    const attempt = game.finish()!;

    expect(attempt.answers).toEqual({ 'q-cap-1': 2, 'q-cap-2': 3, 'q-cap-3': 2, 'q-cap-4': 3 });
    expect(attempt.correctCount).toBe(4);
    expect(attempt.score).toBe(1);
    expect(attempt.finishedAt).toBeGreaterThan(0);

    // La tentative relue depuis le stockage (après actualisation) porte aussi les réponses.
    const stored = quizService.getAttemptById(attempt.id)!;
    expect(stored.answers).toEqual(attempt.answers);
  });

  it('marque -1 les questions non répondues', () => {
    const quiz = quizService.getQuiz('quiz-capitals')!;
    game.start(quiz, eleve);
    game.answer(quiz.questions[0].id, quiz.questions[0].correctIndex);

    const attempt = game.finish()!;

    expect(attempt.answers['q-cap-1']).toBe(2);
    expect(attempt.answers['q-cap-2']).toBe(-1);
    expect(attempt.correctCount).toBe(1);
    expect(attempt.score).toBe(0.25);
  });

  it('le classement ignore une tentative abandonnée et compte la tentative terminée', () => {
    const quiz = quizService.getQuiz('quiz-cinema')!;
    const avant = quizService.leaderboard().find((s) => s.studentId === eleve.id)?.attempts ?? 0;

    // Tentative commencée puis abandonnée : elle ne doit pas entrer au classement.
    game.start(quiz, eleve);
    expect(quizService.leaderboard().find((s) => s.studentId === eleve.id)?.attempts ?? 0).toBe(avant);

    // Tentative rejouée puis terminée avec toutes les bonnes réponses.
    game.start(quiz, eleve);
    for (const question of quiz.questions) {
      game.answer(question.id, question.correctIndex);
    }
    const attempt = game.finish()!;

    const ligne = quizService.leaderboard().find((s) => s.studentId === eleve.id)!;
    const terminees = quizService.attempts().filter((a) => a.studentId === eleve.id && a.finishedAt > 0);
    const enCours = quizService.attempts().filter((a) => a.studentId === eleve.id && a.finishedAt <= 0);

    expect(ligne.attempts).toBe(avant + 1);
    expect(terminees.some((a) => a.id === attempt.id && a.score === 1)).toBe(true);
    expect(ligne.avgScore).toBeCloseTo(terminees.reduce((sum, a) => sum + a.score, 0) / terminees.length, 10);
    // La tentative abandonnée a été remplacée par la nouvelle : aucun 0 parasite.
    expect(enCours).toHaveLength(0);
  });

  it('ne termine la tentative qu’une seule fois', () => {
    const quiz = quizService.getQuiz('quiz-capitals')!;
    game.start(quiz, eleve);
    game.answer(quiz.questions[0].id, quiz.questions[0].correctIndex);

    const premier = game.finish()!;
    const second = game.finish()!;

    expect(second).toBe(premier);
    expect(second.finishedAt).toBe(premier.finishedAt);
  });
});
