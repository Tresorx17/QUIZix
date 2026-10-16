import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { QuizService } from '../core/quiz.service';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent {
  private readonly quizService = inject(QuizService);
  protected readonly auth = inject(AuthService);

  protected readonly scores = computed(() => this.quizService.leaderboard());

  protected readonly currentUser = this.auth.currentUser;

  protected rankLabel(rank: number): string {
    if (rank === 1) {
      return '1er';
    }
    if (rank === 2) {
      return '2e';
    }
    if (rank === 3) {
      return '3e';
    }
    return `${rank}e`;
  }

  protected scorePercent(score: number): number {
    return Math.round(score * 100);
  }
}
