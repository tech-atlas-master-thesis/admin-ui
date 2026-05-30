import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConfigurationStateDto } from '@api/models/configuration/configuration-state-dto';
import { Tag } from 'primeng/tag';
import { TranslocoPipe } from '@jsverse/transloco';
import { Severity } from '@shared/types/severity';

@Component({
  selector: 'app-configuration-state-tag',
  imports: [Tag, TranslocoPipe],
  templateUrl: './configuration-state-tag.component.html',
  styleUrl: './configuration-state-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationStateTag {
  protected readonly severityMap: Record<ConfigurationStateDto, Severity> = {
    [ConfigurationStateDto.DRAFT]: 'info',
    [ConfigurationStateDto.ACTIVE]: 'success',
    [ConfigurationStateDto.ARCHIVED]: 'warn',
  };

  currentState = input.required<ConfigurationStateDto>();
  previousState = input<ConfigurationStateDto>();
}
