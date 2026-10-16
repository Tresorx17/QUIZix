import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { STUDENT_USERS } from '../../core/auth.service';
import { GameService } from '../../core/game.service';
import { QuizService } from '../../core/quiz.service';
import { QuizResultsComponent } from './quiz-results.component';

const eleve = STUDENT_USERS[0];

describe('QuizResultsComponent', () => {
  let quizService: QuizService;
  let game: GameService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }, provideRouter([])],
    });
    quizService = TestBed.inject(QuizService);
    game = TestBed.inject(GameService);
  });

  it('affiche les réponses choisies dans la correction', () => {
    const quiz = quizService.getQuiz('quiz-capitals')!;
    game.start(quiz, eleve);
    for (const question of quiz.questions) {
      game.answer(question.id, question.correctIndex);
    }
    const attempt = game.finish()!;

    // Le composant relit la tentative via l'état de navigation (cas après « Terminer »).
    window.history.replaceState({ attempt }, '');
    const fixture = TestBed.createComponent(QuizResultsComponent);
    fixture.detectChanges();

    const correction = (fixture.nativeElement as HTMLElement).querySelector('.result-screen__questions')!.textContent!;
    expect(correction).toContain('Votre réponse : Paris');
    expect(correction).toContain('Votre réponse : Ottawa');
    expect(correction).not.toContain('Non répondue');
  });

  it('affiche « Non répondue » pour une question laissée vide', () => {
    const quiz = quizService.getQuiz('quiz-capitals')!;
    game.start(quiz, eleve);
    game.answer(quiz.questions[0].id, quiz.questions[0].correctIndex);
    const attempt = game.finish()!;

    window.history.replaceState({ attempt }, '');
    const fixture = TestBed.createComponent(QuizResultsComponent);
    fixture.detectChanges();

    const correction = (fixture.nativeElement as HTMLElement).querySelector('.result-screen__questions')!.textContent!;
    const scores = (fixture.nativeElement as HTMLElement).querySelector('.result-screen__meta')!.textContent!;
    expect(correction).toContain('Votre réponse : Paris');
    expect(correction.match(/Non répondue/g)).toHaveLength(3);
    expect(scores).toContain('1 / 4');
  });
});
