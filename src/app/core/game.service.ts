import { inject, Injectable, signal } from '@angular/core';
import { Quiz, QuizAttempt, User } from './models';
import { QuizService } from './quiz.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly quizService = inject(QuizService);

  readonly quizId = signal<string | null>(null);
  readonly attemptId = signal<string | null>(null);
  readonly currentIndex = signal<number>(0);
  readonly answers = signal<Record<string, number>>({});
  readonly secondsLeft = signal<number>(0);
  readonly durationSec = signal<number>(0);
  readonly finishedAttempt = signal<QuizAttempt | null>(null);

  start(quiz: Quiz, student: User): void {
    const attempt = this.quizService.startAttempt(quiz.id, student);
    this.quizId.set(quiz.id);
    this.attemptId.set(attempt ? attempt.id : null);
    this.answers.set({});
    this.currentIndex.set(0);
    this.secondsLeft.set(quiz.timeLimitSec);
    this.durationSec.set(quiz.timeLimitSec);
    this.finishedAttempt.set(null);
  }

  tick(): void {
    const current = this.secondsLeft();
    if (current > 0) {
      this.secondsLeft.set(current - 1);
    }
  }

  reset(): void {
    this.quizId.set(null);
    this.attemptId.set(null);
    this.answers.set({});
    this.currentIndex.set(0);
    this.secondsLeft.set(0);
    this.durationSec.set(0);
    this.finishedAttempt.set(null);
  }

  answer(questionId: string, optionIndex: number): void {
    if (this.finishedAttempt()) {
      return;
    }
    const currentAnswers = { ...this.answers(), [questionId]: optionIndex };
    this.answers.set(currentAnswers);
    if (this.currentIndex() + 1 < this.totalQuestions()) {
      this.currentIndex.set(this.currentIndex() + 1);
    }
  }

  finish(): QuizAttempt | null {
    const attemptId = this.attemptId();
    const attempt = this.quizService.getAttemptById(attemptId ?? '');
    if (!attempt) {
      return null;
    }
    const answers = this.answers();
    const quiz = this.quizService.getQuiz(this.quizId() ?? '');
    const questionIds = quiz?.questions.map((q) => q.id) ?? [];
    const answeredIds = questionIds.filter((id) => answers[id] !== undefined);
    let correctCount = 0;
    for (const qid of answeredIds) {
      const question = quiz?.questions.find((q) => q.id === qid);
      if (question && answers[qid] === question.correctIndex) {
        correctCount += 1;
      }
    }
    const totalQuestions = quiz?.questions.length ?? 0;
    const score = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const elapsed = Math.max(0, this.durationSec() - this.secondsLeft());
    const finished: QuizAttempt = { ...attempt, score, correctCount, durationSec: elapsed, finishedAt: Date.now() };
    this.quizService.saveAttempt(finished);
    this.finishedAttempt.set(finished);
    return finished;
  }

  totalQuestions(): number {
    const quiz = this.quizService.getQuiz(this.quizId() ?? '');
    return quiz?.questions.length ?? 0;
  }
}
