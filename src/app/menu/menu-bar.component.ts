import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { I18nService } from '@shared/i18n/i18n-service';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import environment from '../../environment/environment';
import { Menu } from 'primeng/menu';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-menu-bar',
  imports: [Menubar, Button, Menu, NgOptimizedImage],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBar {
  private readonly i18nService = inject(I18nService);
  protected readonly BASE_URL = environment.baseUrl;

  isDarkMode = signal(false);
  menuItems = computed<MenuItem[]>(() => {
    this.i18nService.currentLanguage();
    return [
      {
        label: this.i18nService.instant('dashboard.title'),
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: this.i18nService.instant('scraper.title'),
        items: [
          {
            label: this.i18nService.instant('pipelines.title'),
            routerLink: '/scraper/pipelines',
          },
        ],
      },
      {
        label: this.i18nService.instant('transformer.title'),
        items: [
          {
            label: this.i18nService.instant('pipelines.title'),
            routerLink: '/transformer/pipelines',
          },
        ],
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
