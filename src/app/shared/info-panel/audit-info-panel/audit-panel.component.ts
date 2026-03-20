import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InfoPanel } from '@shared/info-panel/info-panel';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuditInfo } from '@shared/info-panel/audit-info-panel/audit-info/audit-info';
import { AuditInfoDto } from '@api/models/audit-info-dto';

@Component({
  selector: 'app-audit-panel',
  imports: [InfoPanel, TranslocoPipe, AuditInfo],
  templateUrl: './audit-panel.component.html',
  styleUrl: './audit-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditPanel {
  protected readonly Object = Object;
  created = input<AuditInfoDto>();
  modified = input<AuditInfoDto>();
}
