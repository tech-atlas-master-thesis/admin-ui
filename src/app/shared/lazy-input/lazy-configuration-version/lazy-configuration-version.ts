import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LazyInput } from '@shared/lazy-input/lazy-input';
import { ConfigurationApi } from '@api/service/configuration-api';
import { PaginatorState } from 'primeng/paginator';
import { catchError, Observable, of } from 'rxjs';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import { SelectItem } from 'primeng/api';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { TranslocoPipe } from '@jsverse/transloco';
import { LazySelect } from '@shared/lazy-input/lazy-select/lazy-select';
import { ConfigurationVersionDto } from '@api/models/configuration/configuration-version-dto';
import { ConfigurationStateDto } from '@api/models/configuration/configuration-state-dto';

interface LazyConfigurationVersionArgs {
  configId?: string;
  states?: ConfigurationStateDto[];
}

@Component({
  selector: 'app-lazy-configuration-version',
  imports: [Select, FormsModule, InputText, TranslocoPipe],
  templateUrl: '../lazy-select/lazy-select.html',
  styleUrl: '../lazy-select/lazy-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyConfigurationVersion extends LazySelect<ConfigurationVersionDto, LazyConfigurationVersionArgs> {
  protected override readonly dataKey = 'id';
  protected override lazyInputService = inject(LazyInput<ConfigurationVersionDto, typeof this.dataKey>);
  private readonly configurationApi = inject(ConfigurationApi);

  configId = input<string>();
  versionStates = input<ConfigurationStateDto[]>();

  override getArgs() {
    return {
      configId: this.configId(),
      states: this.versionStates(),
    };
  }
  override fetchOptions(
    args: LazyConfigurationVersionArgs,
    page: PaginatorState,
    filter: string,
  ): Observable<PaginatedListDto<ConfigurationVersionDto>> {
    return args.configId
      ? this.configurationApi
          .getConfigurationVersions(
            args.configId,
            page,
            { name: [{ value: filter }], state: [{ value: args.states }] },
            [],
          )
          .pipe(catchError(() => of({ items: [], page: { totalRecords: 0 } })))
      : of({ items: [], page: { totalRecords: 0 } });
  }
  override convertToMenuItem(item: ConfigurationVersionDto): SelectItem<ConfigurationVersionDto> {
    return {
      value: item,
      label: !item.name || item.name === '' ? item.version.toString() : item.name,
    };
  }
}
