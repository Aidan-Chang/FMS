import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Profiler, Theming } from '@fms/svc/core';

@Component({
  selector: 'f-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: [],
})
export class AppPage implements OnInit {

  protected readonly title = signal('FMS');
  theme = inject(Theming);
  profiler = inject(Profiler);

  ngOnInit(): void {
    const element = document.querySelector('html');
    if (this.theme.value() == 'light') {
      element?.classList.remove('app-dark');
    } else {
      element?.classList.add('app-dark');
    }
  }

}
