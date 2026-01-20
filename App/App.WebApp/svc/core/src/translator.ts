import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class Translator {

  value = signal(localStorage.getItem('language') || 'en-US');
  items: MenuItem[] =
    [
      { text: 'English', value: 'en-US' },
      { text: 'Taiwan', value: 'zh-TW' },
    ].map(item => ({
      label: item.text,
      state: { value: item.value },
      icon: this.value() == item.value ? 'pi pi-check' : 'pi pi-minus',
      styleClass: this.value() == item.value ? 'p-menu-item-active' : '',
      command: () => this.change(item.value),
    }));

  constructor() { }

  change(language: string) {
    this.items.forEach(item => {
      const active = item.state && item.state["value"] == language
      item.icon = active ? 'pi pi-check' : 'pi pi-minus';
      item.styleClass = active ? 'p-menu-item-active' : '';
    });
    this.value.set(language);
    localStorage.setItem('language', language);
  }

}
