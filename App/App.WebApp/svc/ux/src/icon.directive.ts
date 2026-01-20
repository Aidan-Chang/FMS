import { Directive, ElementRef, inject, input, afterRenderEffect } from '@angular/core';

@Directive({
  selector: '[icon]',
})
export class IconMutate {

  el = inject(ElementRef);
  icon = input<string>('');

  constructor() {
    afterRenderEffect(() => {
      const element = this.el.nativeElement as HTMLElement;
      const iconValue = this.icon() || element.getAttribute('icon');
      if (iconValue) {
        const iconType = iconValue.split(' ')[0] || '';
        const iconName = iconValue.split(' ')[1] || '';
        switch (element.tagName.toLowerCase()) {
          case 'p-button':
            const button = (element?.children[0] as HTMLElement);
            if (button) {
              const icon = button.querySelector('.p-button-icon') as HTMLElement;
              if (icon) {
                switch (iconType) {
                  case 'mso':
                    icon.classList.forEach(c => {
                      if ((c.startsWith('p-button') || c == 'mso') == false) {
                        icon.classList.remove(c);
                      }
                    });
                    icon.innerHTML = iconName;
                    break;
                  case 'pi':
                  case 'fa':
                    break;
                }
              }
            }
            break;
          case "i":
            break;
          case "span":
            break;
        }
      }
    });
  }
}