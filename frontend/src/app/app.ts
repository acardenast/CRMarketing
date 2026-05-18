import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';

const PUBLIC_ROUTES = ['/login', '/registro'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'CRM';
  showSidebar = signal(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const isPublic = PUBLIC_ROUTES.some(p => e.urlAfterRedirects.startsWith(p));
        this.showSidebar.set(!isPublic);
      });
  }
}
