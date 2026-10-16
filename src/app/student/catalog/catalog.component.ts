import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../core/quiz.service';

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent {
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);

  protected readonly quizzes = computed(() => this.quizService.quizzes().filter((q) => q.status === 'published'));
  protected readonly search = signal('');
  protected readonly minDifficulty = signal<number>(1);

  protected readonly filteredQuizzes = computed(() =>
    this.quizzes().filter((q) => {
      const search = this.search().trim().toLowerCase();
      const matchesSearch = !search || q.title.toLowerCase().includes(search) || q.description.toLowerCase().includes(search);
      const matchesDifficulty = q.questions.every((question) => question.difficulty >= this.minDifficulty());
      return matchesSearch && matchesDifficulty;
    }),
  );

  protected startQuiz(id: string): void {
    this.router.navigate(['/quiz', id]);
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected onDifficultyChange(event: Event): void {
    this.minDifficulty.set(Number((event.target as HTMLSelectElement).value));
  }
}
