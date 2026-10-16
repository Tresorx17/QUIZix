import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Question, Quiz, QuizAttempt } from '../../core/models';
import { AuthService } from '../../core/auth.service';
import { QuizService } from '../../core/quiz.service';

@Component({
  selector: 'app-quiz-results',
  imports: [DecimalPipe],
  templateUrl: './quiz-results.component.html',
})
export class QuizResultsComponent implements OnInit {
  private readonly quizService = inject(QuizService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly attempt = signal<QuizAttempt | null>(null);

  protected readonly quiz = computed<Quiz | null>(() => {
    const attempt = this.attempt();
    if (!attempt) {
      return null;
    }
    return this.quizService.getQuiz(attempt.quizId) ?? null;
  });

  ngOnInit(): void {
    const attemptId = this.route.snapshot.paramMap.get('attemptId');
    const state = typeof window === 'undefined' ? null : ((window.history.state?.attempt as QuizAttempt | undefined) ?? null);
    const found = attemptId ? (this.quizService.getAttemptById(attemptId) ?? state) : (state ?? this.latestAttempt());
    this.attempt.set(found);
  }

  private latestAttempt(): QuizAttempt | null {
    const user = this.auth.currentUser();
    if (!user) {
      return null;
    }
    const finished = this.quizService
      .attempts()
      .filter((a) => a.studentId === user.id && a.finishedAt > 0)
      .sort((a, b) => b.finishedAt - a.finishedAt);
    return finished[0] ?? null;
  }

  protected get secondsText(): string {
    const attempt = this.attempt();
    if (!attempt) {
      return '00:00';
    }
    const total = Math.max(0, attempt.durationSec);
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  protected answerText(attempt: QuizAttempt, question: Question): string {
    const idx = attempt.answers[question.id];
    if (idx === undefined || idx < 0 || idx >= question.options.length) {
      return 'Non répondue';
    }
    return question.options[idx];
  }

  protected goToCatalog(): void {
    void this.router.navigate(['/catalog']);
  }
}
