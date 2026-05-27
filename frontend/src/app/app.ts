import { Component, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  title = 'CRM';
  showSidebar = signal(false);

  constructor(private router: Router, private auth: AuthService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;
        // Mostrar sidebar solo en rutas privadas (no en landing, login ni registro)
        const isPrivate = url !== '/' && !url.startsWith('/login') && !url.startsWith('/registro');
        this.showSidebar.set(isPrivate);
      });
  }

  ngOnInit(): void {
    if (this.auth.isAuth()) {
      this.auth.me().subscribe({
        error: () => this.auth.logout()
      });
    }
  }
}
