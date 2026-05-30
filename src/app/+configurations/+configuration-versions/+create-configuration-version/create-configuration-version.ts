import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ConfigurationVersionsStore } from '../configuration-versions.store';
import { ConfigurationStore } from '../configuration.store';
import { LazyConfigurationVersion } from '@shared/lazy-input/lazy-configuration-version/lazy-configuration-version';
import { ConfigurationVersionDto } from '@api/models/configuration/configuration-version-dto';
import { FormsModule } from '@angular/forms';

interface CreateVersionModel {
  name: string;
  description: string;
  baseVersion: ConfigurationVersionDto | null;
}

@Component({
  selector: 'app-create-configuration-version',
  imports: [Button, InputText, Textarea, TranslocoPipe, FormField, LazyConfigurationVersion, FormsModule],
  templateUrl: './create-configuration-version.html',
  styleUrl: './create-configuration-version.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateConfigurationVersion {
  protected readonly configurationStore = inject(ConfigurationStore);
  private readonly configurationVersionsStore = inject(ConfigurationVersionsStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  creationModel = signal<CreateVersionModel>({
    name: '',
    description: '',
    baseVersion: null,
  });
  versionForm = form<CreateVersionModel>(this.creationModel);

  protected onVersionCreate() {
    const { name, description, baseVersion } = this.creationModel();
    const configurationId = this.configurationStore.configurationId();
    if (!configurationId) {
      return;
    }
    this.configurationVersionsStore
      .createVersion$(configurationId, {
        type: configurationId,
        name,
        description,
        baseVersionId: baseVersion?.id,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((version) => this.router.navigate(['version', version.id], { relativeTo: this.activatedRoute.parent })),
      )
      .subscribe();
  }
}
