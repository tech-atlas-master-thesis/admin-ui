import { ChangeDetectorRef, Directive, effect, ElementRef, HostBinding, inject, input } from '@angular/core';
import { AuthService } from '@shared/auth/auth.service';

@Directive({
  selector: '[appAuthorization]',
})
export class AuthorizationDirective {
  private readonly authService = inject(AuthService);
  private readonly el = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @HostBinding('class.p-disabled')
  disabledClass = false;

  appAuthorization = input<string>();

  constructor() {
    this.initAuthCheck();
  }

  private initAuthCheck() {
    effect(() => {
      const role = this.appAuthorization();
      const allowed = !role || this.authService.checkSync(role);
      if (this.canDisableByClass(this.el)) {
        this.disabledClass = allowed;
      }
      this.cdr.markForCheck();
    });
  }

  private canDisableByClass(tag: ElementRef) {
    const tagName = tag.nativeElement?.tagName?.toLowerCase();
    return ['button', 'input', 'fieldset', 'optgroup', 'option', 'select', 'textarea'].includes(tagName);
  }
}
