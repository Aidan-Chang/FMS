import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class Navigator {

  value = signal(localStorage.getItem('sidebar') || 'expanded');
  items = signal<MenuItem[]>([
    { id: '1', label: 'Home', icon: 'pi pi-folder', tooltip: 'Home', items: [
      { id: '11', label: '一般', icon: 'pi pi-folder', expanded: true, items: [
        { id: '111', label: 'Home', icon: 'pi pi-home', routerLink: '/home' },
      ] },
    ] },
    { id: '2', label: 'Equipment', icon: 'pi pi-folder', tooltip: 'Equipment', items: [] },
    { id: '3', label: 'Warehouse', icon: 'pi pi-folder', tooltip: 'Warehouse', items: [] },
    { id: '4', label: 'Production', icon: 'pi pi-folder', tooltip: 'Production', items: [] },
    { id: '5', label: 'Quantity', icon: 'pi pi-folder', tooltip: 'Quantity', items: [
      { id: '51', label: '記錄追蹤', icon: 'pi pi-folder', items: [
        { id: '511', label: 'Capture', icon: 'pi pi-camera', routerLink: '/tqm/track/capture' },
      ] },
    ] },
    { id: '6', label: 'Admin', icon: 'pi pi-folder', tooltip: 'Administraction', items: [
      { id: '61', label: '帳號管理', icon: 'pi pi-folder', items: [
      ] },
      { id: '62', label: '系統管理', icon: 'pi pi-folder', items: [
        { id: '622', label: 'API', icon: 'pi pi-bookmark', routerLink: '/sme/server/api' },
        { id: '623', label: 'Errors', icon: 'pi pi-caret-right', routerLink: '/sme/server/log' },
        { id: '624', label: 'Tasks', icon: 'pi pi-image', routerLink: '/sme/server/task' },
      ] },
    ] },
  ]);

  constructor() { }

  toggle() {
    this.value.update(value => value == 'expanded' ? 'collapsed' : 'expanded');
    localStorage.setItem('sidebar', this.value());
  }

}
