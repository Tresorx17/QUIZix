import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { STUDENT_USERS } from '../core/auth.service';
import { User } from '../core/models';
import { QuizService } from '../core/quiz.service';
import { LeaderboardComponent } from './leaderboard.component';

function createFixture(): ComponentFixture<LeaderboardComponent> {
  const fixture = TestBed.createComponent(LeaderboardComponent);
  fixture.detectChanges();
  return fixture;
}

function lignes(fixture: ComponentFixture<LeaderboardComponent>): string[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.leaderboard__row') as NodeListOf<HTMLElement>,
  ).map((ligne) => ligne.textContent ?? '');
}

/** Parcours reel d'un eleve : lancer le quiz puis terminer la tentative. */
function terminerQuiz(quizService: QuizService, student: User, quizId: string, score: number): void {
  const tentative = quizService.startAttempt(quizId, student);
  if (!tentative) {
    throw new Error(`Quiz ${quizId} injoignable pour ${student.username}`);
  }
  quizService.saveAttempt({ ...tentative, score, finishedAt: Date.now() });
}

const eleveMarie = STUDENT_USERS.find((u) => u.id === 'u-marie')!;

describe('LeaderboardComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  it('classe les eleves par score moyen decroissant', () => {
    const rows = lignes(createFixture());

    expect(rows.length).toBe(3);
    expect(rows[0]).toContain('Marie');
    expect(rows[0]).toContain('1er');
    expect(rows[0]).toContain('100%');
    expect(rows[1]).toContain('2e');
    expect(rows[2]).toContain('3e');
  });

  it('compte les tentatives terminees de chaque eleve', () => {
    const quizService = TestBed.inject(QuizService);

    // Marie termine une seconde tentative en plus de celle des donnees de depart.
    terminerQuiz(quizService, eleveMarie, 'quiz-capitals', 0.5);

    const rows = lignes(createFixture());

    expect(rows.some((row) => row.includes('Marie') && row.includes('2 tentatives'))).toBe(true);
    expect(rows.some((row) => row.includes('Élève') && row.includes('1 tentative'))).toBe(true);
  });

  it('departage les eleves a score egal selon leur identifiant', () => {
    const quizService = TestBed.inject(QuizService);

    // Trois eleves au meme score moyen (1), avec des identifiants et des noms
    // volontairement dans un ordre different : l identifiant doit primer.
    for (const student of [
      { id: 'u-aaa', username: 'zoe', displayName: 'Zoe' },
      { id: 'u-zzz', username: 'alice', displayName: 'Alice' },
    ]) {
      terminerQuiz(quizService, { ...student, password: 'motdepasse', role: 'student' }, 'quiz-cinema', 1);
    }

    const fixture = createFixture();
    const premier = lignes(fixture);

    // u-aaa, puis u-marie (donnees de depart), puis u-zzz.
    expect(premier[0]).toContain('Zoe');
    expect(premier[0]).toContain('1er');
    expect(premier[1]).toContain('Marie');
    expect(premier[2]).toContain('Alice');
    // L ordre reste stable d un affichage a l autre.
    expect(lignes(fixture)).toEqual(premier);
  });

  it('ignore les tentatives non terminees', () => {
    const quizService = TestBed.inject(QuizService);
    const tentative = quizService.startAttempt('quiz-capitals', {
      id: 'u-nouveau',
      username: 'nouveau',
      displayName: 'Nouveau',
      password: 'motdepasse',
      role: 'student',
    })!;

    const rows = lignes(createFixture());

    expect(tentative.finishedAt).toBe(0);
    expect(rows.some((row) => row.includes('Nouveau'))).toBe(false);
  });
});
