import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, effect, inject } from '@angular/core';
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
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly user = this.auth.currentUser;

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const url = this.router.url;
      // La session vit dans le navigateur : pendant le rendu serveur, rediriger
      // enverrait un utilisateur connecte vers /login a chaque rafraichissement.
      if (isPlatformBrowser(this.platformId) && !user && !url.startsWith('/login')) {
        void this.router.navigate(['/login']);
      }
    });
  }
}
