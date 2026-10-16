import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, STUDENT_USERS, TEACHER_USER } from '../../core/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly teacher = TEACHER_USER;
  protected readonly demoStudents = STUDENT_USERS;

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly error = signal<string | null>(null);

  protected onUsernameInput(event: Event): void {
    this.username.set((event.target as HTMLInputElement).value);
  }

  protected onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.connect(this.username(), this.password());
  }

  protected quickLogin(user: User): void {
    this.connect(user.username, user.password);
  }

  private connect(username: string, password: string): void {
    const user = this.auth.login(username, password);
    if (!user) {
      this.error.set('Identifiants incorrects.');
      return;
    }
    this.error.set(null);
    void this.router.navigate(user.role === 'teacher' ? ['/dashboard'] : ['/catalog']);
  }
}
