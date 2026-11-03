import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button, ButtonSeverity } from '@openng/optimus-ui/button';
import { Popover } from '@openng/optimus-ui/popover';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-info-panel',
  imports: [Button, Popover, TranslocoPipe],
  templateUrl: './info-panel.html',
  styleUrl: './info-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPanel {
  icon = input<string>('pi pi-info-circle');
  severity = input<ButtonSeverity>('primary');
  title = input<string>();
}
