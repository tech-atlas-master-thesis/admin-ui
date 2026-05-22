import { ChangeDetectionStrategy, Component, computed, inject, input, TemplateRef, viewChild } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { I18nService } from '@shared/i18n/i18n-service';

@Component({
  selector: 'app-table-skeleton',
  imports: [Skeleton],
  templateUrl: './table-skeleton.html',
  styleUrl: './table-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSkeleton {
  private readonly i18nService = inject(I18nService);

  columns = input.required<number>();
  loading = input(false);
  rows = input<number>(5);
  textHeight = input('1.25rem');
  rowContentHeight = input('40px');
  missingText = input<string>();

  columnsRange = computed(() => this.getRange(this.columns()));
  rowsRange = computed(() => this.getRange(this.rows()));

  missingTextWithFallback = computed(() => {
    this.i18nService.currentLanguage();
    const missingText = this.missingText();
    if (missingText) {
      return missingText;
    }
    return this.i18nService.instant('table.missingData');
  });

  template = viewChild<TemplateRef<unknown>>('template');

  private getRange(length: number) {
    return [...Array(length).keys()];
  }
}
