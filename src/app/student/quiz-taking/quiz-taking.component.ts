import { Component, DestroyRef, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { GameService } from '../../core/game.service';
import { Quiz, QuizAttempt } from '../../core/models';
import { QuizService } from '../../core/quiz.service';

@Component({
  selector: 'app-quiz-taking',
  imports: [DecimalPipe],
  templateUrl: './quiz-taking.component.html',
})
export class QuizTakingComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly quizService = inject(QuizService);
  private readonly game = inject(GameService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private subscription: Subscription | null = null;

  protected readonly quiz = signal<Quiz | undefined>(undefined);
  protected readonly currentUser = this.auth.currentUser;

  protected readonly secondsLeft = this.game.secondsLeft;
  protected readonly currentIndex = this.game.currentIndex;
  protected readonly answers = this.game.answers;
  protected readonly finished = this.game.finishedAttempt;

  protected readonly currentQuestion = computed(() => {
    const q = this.quiz();
    const index = this.game.currentIndex();
    return q?.questions[index] ?? null;
  });

  protected readonly progress = computed(() => {
    const q = this.quiz();
    if (!q || q.questions.length === 0) {
      return 0;
    }
    return Math.round((this.game.currentIndex() / q.questions.length) * 100);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const user = this.auth.currentUser();
    const q = id ? this.quizService.getQuiz(id) : undefined;
    if (!user || user.role !== 'student' || !q || q.status !== 'published') {
      void this.router.navigate(['/catalog']);
      return;
    }
    this.quiz.set(q);
    this.game.start(q, user);

    this.subscription = interval(1000).subscribe(() => {
      const current = this.game.secondsLeft();
      if (current > 0) {
        this.game.tick();
      } else {
        this.finish();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected answer(optionIndex: number): void {
    const question = this.currentQuestion();
    if (!question || this.finished()) {
      return;
    }
    this.game.answer(question.id, optionIndex);
  }

  protected get secondsText(): string {
    const s = Math.max(0, this.game.secondsLeft());
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  protected finish(): void {
    const attempt = this.game.finish();
    if (attempt) {
      void this.router.navigate(['/results'], { state: { attempt } });
    }
  }

  protected finishAgain(): void {
    this.game.reset();
    void this.router.navigate(['/quiz', this.game.quizId() ?? '']);
  }

  protected goToCatalog(): void {
    this.game.reset();
    void this.router.navigate(['/catalog']);
  }
}
