import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DatePipe } from '@angular/common';
import { AuditInfoDto } from '@api/models/audit-info-dto';

@Component({
  selector: 'app-audit-info',
  imports: [TranslocoPipe, DatePipe],
  templateUrl: './audit-info.html',
  styleUrl: './audit-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditInfo {
  auditInfo = input.required<AuditInfoDto>();
}
