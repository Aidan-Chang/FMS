import { Injectable, signal, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class Theming {

  value = signal(localStorage.getItem('colorMode') || 'light');
  icon = computed(() => this.items[this.value()].icon);
  items: MenuItem = [
    { text: 'Light', value: 'light', icon: 'pi pi-sun' },
    { text: 'Dark', value: 'dark', icon: 'pi pi-moon' },
  ].reduce((o: any, v) => (o[v.value] = v, o), {});

  constructor() { }

  toggle() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark');
    this.value.update(value => value == 'light' ? 'dark' : 'light');
    localStorage.setItem('colorMode', this.value());
  }

}
