import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { QuizService } from '../../core/quiz.service';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [DecimalPipe],
  templateUrl: './teacher-dashboard.component.html',
})
export class TeacherDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);

  protected readonly teacherId = this.auth.currentUser()?.id ?? '';
  protected readonly quizzes = this.quizService.quizzes;
  protected readonly attempts = this.quizService.attempts;

  protected readonly stats = computed(() => this.quizService.teacherStats(this.teacherId));

  protected readonly teacherQuizzes = computed(() =>
    this.teacherId ? this.quizService.getTeacherQuizzes(this.teacherId) : [],
  );

  protected createQuiz(): void {
    void this.router.navigate(['/dashboard/new']);
  }

  protected editQuiz(id: string): void {
    void this.router.navigate(['/dashboard', id, 'edit']);
  }

  protected togglePublish(id: string): void {
    const quiz = this.quizService.getQuiz(id);
    if (!quiz) {
      return;
    }
    this.quizService.setQuizStatus(id, quiz.status === 'published' ? 'draft' : 'published');
  }

  protected removeQuiz(id: string): void {
    if (window.confirm('Supprimer ce quiz et toutes ses tentatives associees ?')) {
      this.quizService.deleteQuiz(id);
    }
  }
}
