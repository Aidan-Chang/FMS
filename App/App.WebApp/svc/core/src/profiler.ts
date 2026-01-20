import { inject, Injectable, signal, effect } from '@angular/core';
import { Theming } from './theming'

declare var MiniProfiler: any;

@Injectable({
  providedIn: 'root'
})
export class Profiler {

  theming = inject(Theming);
  value = signal((localStorage.getItem('MiniProfiler-Display') || 'block') == 'block' ? true : false);
  baseUrl = '/';

  constructor() {
    const el: HTMLScriptElement | undefined = document.getElementById('mini-profiler') as HTMLScriptElement;
    if (!el) {
      this.initializeScriptResouce();
    }
    effect(() => {
      const el = document.getElementsByClassName('mp-results');
      const dark = this.theming.value() == 'dark';
      if (el && el.length > 0) {
        if (dark) {
          el[0].classList.add('mp-scheme-dark');
          el[0].classList.remove('mp-scheme-light');
        } else {
          el[0].classList.add('mp-scheme-light');
          el[0].classList.remove('mp-scheme-dark');
        }
      }
    });
  }

  toggle() {
    if (typeof MiniProfiler !== 'undefined') {
      const state = MiniProfiler.container.style.display == 'none' ? 'block' : 'none';
      MiniProfiler.container.style.display = state;
      localStorage.setItem('MiniProfiler-Display', state);
      this.value.set(state == 'block' ? true : false);
    }
  }

  initializeScriptResouce() {
    const node = document.createElement('script');
    node.async = true;
    node.id = 'mini-profiler';
    node.src = `${this.baseUrl}profiler/includes.min.js?v=4.5.4`;
    node.setAttribute('data-version', '4.5.4');
    node.setAttribute('data-path', `${this.baseUrl}profiler/`);
    node.setAttribute('data-current-id', '');
    node.setAttribute('data-ids', '');
    node.setAttribute('data-position', 'Right');
    node.setAttribute('data-start-hidden', 'true');
    node.setAttribute('data-scheme', this.theming.value() == 'dark' ? 'Dark' : 'Light');
    node.setAttribute('data-decimal-places', '2');
    node.setAttribute('data-authorized', 'true');
    node.setAttribute('data-max-traces', '15');
    node.setAttribute('data-toggle-shortcut', 'Alt+P');
    node.setAttribute('data-trivial-milliseconds', '2.0');
    node.setAttribute('data-ignored-duplicate-execute-types', 'Open,OpenAsync,Close,CloseAsync');
    node.setAttribute('data-trivial-milliseconds', '2.0');
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
