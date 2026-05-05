import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '@shared/auth/auth.service';

@Pipe({
  name: 'authorization',
})
export class AuthorizationPipe implements PipeTransform {
  private readonly authService = inject(AuthService);

  transform(role: string): boolean {
    return this.authService.checkSync(role);
  }
}
