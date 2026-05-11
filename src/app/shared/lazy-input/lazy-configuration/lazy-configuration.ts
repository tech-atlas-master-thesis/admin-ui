import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LazySelect } from '@shared/lazy-input/lazy-select/lazy-select';
import { ConfigurationDto } from '@api/models/configuration/configuration-dto';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import { SelectItem } from 'primeng/api';
import { catchError, Observable, of } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { TranslocoPipe } from '@jsverse/transloco';
import { LazyInput } from '@shared/lazy-input/lazy-input';
import { ConfigurationApi } from '@api/service/configuration-api';

@Component({
  selector: 'app-lazy-configuration',
  imports: [Select, FormsModule, InputText, TranslocoPipe],
  templateUrl: '../lazy-select/lazy-select.html',
  styleUrl: '../lazy-select/lazy-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyConfiguration extends LazySelect<ConfigurationDto, string | undefined> {
  protected override readonly dataKey = 'id';
  protected override lazyInputService = inject(LazyInput<ConfigurationDto, typeof this.dataKey>);
  private configurationApi = inject(ConfigurationApi);

  configType = input<string>();

  override getArgs() {
    return this.configType();
  }
  override fetchOptions(
    args: string | undefined,
    page: PaginatorState,
    filter: string,
  ): Observable<PaginatedListDto<ConfigurationDto>> {
    return this.configurationApi
      .getConfigurations(page, { name: [{ value: filter }], type: [{ value: args }] }, [])
      .pipe(catchError(() => of({ items: [], page: { totalRecords: 0 } })));
  }
  override convertToMenuItem(item: ConfigurationDto): SelectItem<ConfigurationDto> {
    return {
      value: item,
      label: item.name ?? item.type,
    };
  }
}
