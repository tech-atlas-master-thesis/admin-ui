import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lazy-configuration-version',
  imports: [],
  templateUrl: './lazy-configuration-version.html',
  styleUrl: './lazy-configuration-version.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyConfigurationVersion {}
