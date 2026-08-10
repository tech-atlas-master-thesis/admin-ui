import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { I18nService } from '@shared/i18n/i18n-service';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { NgOptimizedImage } from '@angular/common';
import { Popover } from 'primeng/popover';
import { AuthService } from '@shared/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tag } from 'primeng/tag';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthRole } from '@shared/auth/auth-roles';

@Component({
  selector: 'app-menu-bar',
  imports: [Menubar, Button, Menu, NgOptimizedImage, Popover, Tag, TranslocoPipe],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBar {
  private readonly i18nService = inject(I18nService);
  private readonly authService = inject(AuthService);

  isAuthenticated = toSignal(this.authService.isAuthenticated$);
  userInfo = toSignal(this.authService.userInfo$);
  userRoles = toSignal(this.authService.userRoles$);
  isDarkMode = signal(false);
  menuItems = computed<MenuItem[]>(() => {
    if (!this.isAuthenticated() && this.authService.checkSync(AuthRole.VIEW)) {
      return [];
    }
    this.i18nService.currentLanguage();
    return [
      {
        label: this.i18nService.instant('dashboard.title'),
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: this.i18nService.instant('schedules.title'),
        icon: 'pi pi-clock',
        routerLink: '/schedules',
      },
      {
        label: this.i18nService.instant('pipelines.title'),
        icon: 'pi pi-play-circle',
        routerLink: '/pipelines',
      },
      {
        label: this.i18nService.instant('configurations.title'),
        icon: 'pi pi-wrench',
        routerLink: '/configurations',
      },
      {
        label: this.i18nService.instant('dataSets.title'),
        icon: 'pi pi-database',
        routerLink: '/datasets',
      },
    ];
  });

  languageOptions = computed<MenuItem[]>(() => {
    return this.i18nService.availableLanguages.map((lang) => ({
      label: lang.label,
      command: () => this.i18nService.changeLanguage(lang.id),
    }));
  });

  constructor() {
    this.keepTheme();
    const element = document.querySelector('html');
    this.isDarkMode.set(element?.classList.contains('app-dark-mode') ?? false);
  }

  protected toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');
    this.isDarkMode.set(element?.classList.contains('app-dark-mode') ?? false);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  protected logOut() {
    this.authService.logOut();
  }

  private keepTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.setTheme(theme);
      return;
    }

    const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.setTheme('dark');
      return;
    }

    this.setTheme('light');
  }

  private setTheme(theme: string) {
    const element = document.querySelector('html');
    switch (theme) {
      case 'dark':
        element?.classList.add('app-dark-mode');
        return;
      case 'light':
        element?.classList.remove('app-dark-mode');
        return;
    }
  }
}
