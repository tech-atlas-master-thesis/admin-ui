import { Component, signal } from '@angular/core';
import { Dialog } from '@openng/optimus-ui/dialog';
import { Button } from '@openng/optimus-ui/button';
import { TranslocoPipe } from '@jsverse/transloco';

interface Owner {
  name: string;
  email: string;
  city: string;
}

@Component({
  imports: [Dialog, Button, TranslocoPipe],
  selector: 'app-imprint',
  styleUrl: './imprint.scss',
  templateUrl: './imprint.html',
})
export class Imprint {
  private readonly OWNERS: Owner[] = [
    {
      name: 'Fabian Mooslechner',
      email: 'fabian@mooslechner.dev',
      city: 'Graz',
    },
    {
      name: 'Bastian Kandlbauer',
      email: 'mail@bastiankandlbauer.at',
      city: 'Graz',
    },
  ];

  protected mediaOwners = this.OWNERS.map((owner) => `${owner.name}, ${owner.city}`);
  protected emails = this.OWNERS.map((owner) => owner.email);

  dialogOpen = signal(false);

  onClick() {
    this.dialogOpen.update((open) => !open);
  }
}
