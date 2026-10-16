import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.currentUser;

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const url = this.router.url;
      if (!user && !url.startsWith('/login')) {
        void this.router.navigate(['/login']);
      }
    });
  }
}
