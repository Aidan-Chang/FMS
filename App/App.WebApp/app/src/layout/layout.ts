import { Component, AfterViewInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { Navigator, Theming, PROPERTY } from '@fms/svc/core';
import { IconMutate } from '@fms/svc/ux';

import { LayoutMegaMenu } from './layout#megamenu';
import { LayoutTabMenu } from './layout#tabmenu';

@Component({
  imports: [
    RouterOutlet,
    CommonModule,
    ToolbarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    ButtonGroupModule,
    TooltipModule,
    DividerModule,
    LayoutMegaMenu,
    LayoutTabMenu,
    IconMutate,
  ],
  styles: `
    .container {
      display: flex;
      height:100%;
      width: 100%;
      &-sidebar {
        width: 4rem;
        height: 100%;
        display: flex;
        flex-flow: column;
        border-right: 1px solid var(--p-toolbar-border-color);
        &-header {
          height: 4rem;
          min-height: 4rem;
          display: flex;
          // justify-content: center;
          align-items: center;
          padding-left: .6rem;
          > a {
            cursor: pointer;
          }
          &-logo {
            height: 1.5rem;
          }
          &-label {
            height: 1.5rem;
            padding-left: .5rem;
            opacity: 0;
            visibility: hidden;
          }
          &-toggle {
            position: absolute;
            left: 3.45rem;
            top: 1.35rem;
            opacity: 1;
            visibility: visible;
            font-size: .25rem;
            padding: .25rem;
            color: var(--p-fms-color1);
            border-radius: .75rem;
            background-color: var(--p-fms-color2);
            > i {
              font-size: .75rem;
              font-weight: bold;
            }
          }
        }
        &-expanded {
          width: 16rem;
          .container-sidebar-header {
            &-label {
              opacity: 1;
              visibility: visible;
            }
          }
          .container-sidebar-header-toggle {
            left: 15rem;
            opacity: 0;
            visibility: hidden;
          }
        }
        &-animate {
          transition: width 0.5s ease-in-out;
          .container-sidebar-header {
            &-label {
              transition: opacity 0.5s ease, visibility 0.5s ease;
            }
          }
          .container-sidebar-header-toggle {
            transition: left 0.5s ease-in-out, opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
          }
        }
        &-menu {
          flex-grow: 1;
          min-height: 0;
          border-top: 1px solid var(--p-toolbar-border-color);
          border-bottom: 1px solid var(--p-toolbar-border-color);
        }
        &-footer {
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column;
          font-size: .6rem;
          color: var(--p-fms-color1);
        }
      }
      &-content {
        flex-grow: 1;
        display: flex;
        flex-flow: column;
        &-toolbar {
          height: 4rem;
          border-radius: 0;
          border: 0;
          &-label {
            height: 1.5rem;
            opacity: 1;
            visibility: visible;
          }
          &-buttongroup {
            margin-right: 1rem;
            p-button:not(:last-child) .p-button {
              border-right: solid 1px var(--p-fms-color2);
            }
          }
        }
        &-expanded {
          .container-content {
            &-toolbar {
              &-label {
                opacity: 0;
                visibility: hidden;
              }
            }
          }
        }
        &-animate {
          transition: width 0.5s ease-in-out;
          .container-content {
            &-toolbar {
              &-label {
                transition: opacity 0.5s ease, visibility 0.5s ease;
              }
            }
          }
        }
        &-body {
          flex-grow: 1;
          border-top: 1px solid var(--p-toolbar-border-color);
          border-bottom: 1px solid var(--p-toolbar-border-color);
        }
        &-footer {
          height: 2rem;
        }
      }
    }
    `,
  template: `
    <div class="container">
      <div class="container-sidebar" [class.container-sidebar-expanded]="navigator.value()=='expanded'" [class.container-sidebar-animate]="initialized()">
        <div class="container-sidebar-header">
          <a (click)="navigator.toggle()">
            <img src="logo.png" class="container-sidebar-header-logo" />
            <!-- <div class="container-sidebar-header-toggle">
              <i class="pi pi-chevron-right"></i>
            </div> -->
          </a>
          <img src="label.png" class="container-sidebar-header-label" />
        </div>
        <div class="container-sidebar-menu">
          @if (navigator.value()=='expanded') {
            <f-Layout-TabMenu />
          } @else {
            <f-Layout-MegaMenu />
          }
        </div>
        <div class="container-sidebar-footer">
          <span>
            v{{property.version}}
          </span>
          <span>
            @{{property.owner}}
          </span>
        </div>
      </div>
      <div class="container-content" [class.container-content-expanded]="navigator.value()=='expanded'" [class.container-content-animate]="initialized()">
        <p-toolbar class="container-content-toolbar">
          <ng-template #start>
            <img class="container-content-toolbar-label" src="label.png" pTooltip="Home" tooltipPosition="bottom" />
            <p-breadcrumb></p-breadcrumb>
          </ng-template>
          <ng-template #center>
          </ng-template>
          <ng-template #end>
            <p-button icon="mso folder_code" label="Guest" pTooltip="Account" tooltipPosition="bottom" fIcon />
            <p-divider layout="vertical" />
            <p-buttongroup class="container-content-toolbar-buttongroup">
              <p-button icon="pi pi-inbox" pTooltip="Message" tooltipPosition="bottom" />
              <p-button icon="fa fa-language" pTooltip="Language" tooltipPosition="bottom" />
              <p-button [icon]="theming.icon()" pTooltip="Theme" tooltipPosition="bottom" (click)="theming.toggle()" />
              <p-button icon="pi pi-bars" pTooltip="Options" tooltipPosition="bottom" />
            </p-buttongroup>
          </ng-template>
        </p-toolbar>
        <div class="container-content-body">
          <router-outlet />
        </div>
        <div class="container-content-footer">
          footer
        </div>
      </div>
    </div>
  `,
})
export class Layout implements AfterViewInit {

  property = inject(PROPERTY);
  navigator = inject(Navigator);
  theming = inject(Theming);
  initialized = signal(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialized.set(true);
    });
  }

}