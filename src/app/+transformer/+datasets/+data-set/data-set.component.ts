import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataSetStore } from './data-set.store';
import { DataSetObjectStore } from './data-set-object.store';
import { TranslocoPipe } from '@jsverse/transloco';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

@Component({
  selector: 'app-dataset',
  imports: [TranslocoPipe, Tab, TabList, Tabs, TabPanels, TabPanel],
  templateUrl: './data-set.component.html',
  styleUrl: './data-set.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSetComponent {
  protected readonly dataSetStore = inject(DataSetStore);
  protected readonly dataSetObjectStore = inject(DataSetObjectStore);
}
