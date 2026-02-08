import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { I18nService } from '../shared/i18n/i18n-service';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import environment from '../../environment/environment';

@Component({
  selector: 'app-menu',
  imports: [Menubar, Button],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  private readonly i18nService = inject(I18nService);
  protected readonly BASE_URL = environment.baseUrl;

  isDarkMode = signal(false);
  menuItems = computed<MenuItem[]>(() => {
    this.i18nService.currentLanguage();
    return [
      {
        label: this.i18nService.instant('app.menu.scraper'),
        items: [
          {
            label: this.i18nService.instant('app.menu.pipelines'),
            routerLink: '/scraper/pipelines',
          },
        ],
      },
      {
        label: this.i18nService.instant('app.menu.transformer'),
        items: [
          {
            label: this.i18nService.instant('app.menu.pipelines'),
            routerLink: '/transformer/pipelines',
          },
        ],
      },
    ];
  });

  constructor() {
    this.keepTheme();
    const element = document.querySelector('html');
    this.isDarkMode.set(element?.classList.contains('app-dark-mode') ?? false);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');
    this.isDarkMode.set(element?.classList.contains('app-dark-mode') ?? false);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
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
