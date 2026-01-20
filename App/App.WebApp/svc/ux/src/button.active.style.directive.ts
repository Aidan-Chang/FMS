import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { Button } from 'primeng/button';

@Directive({
  selector: 'p-button',
})
export class ButtonActive {

  activeClassName = 'p-button-active';
  el = inject(ElementRef);
  active = input<boolean | undefined>();

  constructor(button: Button) {
    effect(() => {
      const styleClass = button.styleClass?.split(' ').filter(s=>s == this.activeClassName).join(' ');
      console.log(styleClass);
      button.styleClass = styleClass;
    });
  }

}

// https://stackoverflow.com/questions/53351579/use-angular-6-directive-to-set-property-on-a-component