import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { QuizEditorComponent } from './teacher/quiz-editor/quiz-editor.component';
import { CatalogComponent } from './student/catalog/catalog.component';
import { QuizTakingComponent } from './student/quiz-taking/quiz-taking.component';
import { QuizResultsComponent } from './student/quiz-results/quiz-results.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: TeacherDashboardComponent },
  { path: 'dashboard/new', component: QuizEditorComponent },
  { path: 'dashboard/:id/edit', component: QuizEditorComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'quiz/:id', component: QuizTakingComponent },
  { path: 'results', component: QuizResultsComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
