import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { DockModule } from 'primeng/dock';
import { MenuItem } from 'primeng/api';

@Component({
  imports: [
    RouterOutlet,
    ToolbarModule,
    ButtonGroupModule,
    ButtonModule,
    DockModule,
    RouterLink,
  ],
  template: `
  <div class="container">
    <div class="container-header">
      <p-toolbar class="container-header-toolbar">
        <ng-template #start>
          <div class="container-header-toolbar-button">
            <p-buttongroup>
              <p-button icon="pi pi-home" />
            </p-buttongroup>
          </div>
        </ng-template>
        <ng-template #center>
          <div class="container-header-toolbar-title">
            <img class="container-header-toolbar-title-logo" src="logo.png" />
            <img class="container-header-toolbar-title-label" src="label.png" />
          </div>
        </ng-template>
        <ng-template #end>
          <div class="container-header-toolbar-button" style="text-align: end;">
            <p-buttongroup>
              <p-button icon="pi pi-inbox" />
              <p-button icon="pi pi-bars" />
            </p-buttongroup>
          </div>
        </ng-template>
      </p-toolbar>
    </div>
    <div class="container-content">
      <router-outlet />
    </div>
    <div class="container-footer">
      <p-dock [model]="items" class="container-footer-dock">
        <ng-template #item let-item>
          <a class="container-footer-dock-button" [routerLink]="item.routerLink">
            <i [class]="item.icon"></i>
            <span>{{item.label}}</span>
          </a>
        </ng-template>
      </p-dock>
    </div>
  </div>
  `,
  styles: `
  .container {
    display: flex;
    flex-flow: column;
    width:100%;
    height:100%;
    &-header {
      height: 3rem;
      &-toolbar {
        height: 100%;
        border: 0;
        border-radius: 0;
        &-button {
          width: 6rem;
        }
        &-title {
          display: flex;
          gap: .25rem;
          &-logo {
            height: .75rem;
          }
          &-label {
            height: .75rem;
          }
        }
      }
    }
    &-content {
      flex: 1;
      border-top: solid 1px var(--p-fms-color1);
      border-bottom: solid 1px var(--p-fms-color1);
    }
    &-footer {
      height: 4rem;
      &-dock {
        position: relative;
        height: 100%;
        &-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 2.25rem;
          gap: .1rem;
          color: var(--p-fms-color1);
          > i {
            font-size: 1.75rem; 
          }
          > span {
            font-size: .5rem;
          }
        }
      }
    }
  }
  `
})
export class MobileLayout {

  items: MenuItem[] = [
    { id: '1', label: 'Home', icon: 'pi pi-home', routerLink: '/m/home' },
    { id: '2', label: 'TQM', icon: 'pi pi-map-marker', routerLink: '/m/home' },
    { id: '3', label: 'Capture', icon: 'pi pi-camera', routerLink: '/m/tqm/track/capture' },
    { id: '4', label: 'Repair', icon: 'pi pi-wrench', },
    { id: '5', label: 'More', icon: 'pi pi-bars', },
  ];

}