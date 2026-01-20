import { Component, inject } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MegaMenuModule } from 'primeng/megamenu';
import { TooltipModule } from 'primeng/tooltip';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { Navigator } from '@fms/svc/core';

@Component({
  selector: 'f-Layout-MegaMenu',
  imports: [
    RouterModule,
    MegaMenuModule,
    TooltipModule,
  ],
  template: `
    <div class="container">
      <p-megamenu [model]="items" orientation="vertical" breakpoint="0px" scrollHeight="100%">
        <ng-template #item let-item>
          @if (item.root) {
            <a class="p-megamenu-item-link" [pTooltip]="item.tooltip" tooltipPosition="right">
              <i class="p-megamenu-item-link-icon" [class]="item.icon"></i>
              <span class="p-megamenu-item-link-label">{{item.label}}</span>
              @if(item.items?.length) {
                <i class="p-megamenu-item-link-submenu pi pi-chevron-right"></i>
              }
            </a>
          } @else {
            <a class="p-megamenu-item-link p-megamenu-subitem-link" [routerLink]="item.routerLink">
              <i class="p-megamenu-item-link-icon p-megamenu-subitem-link-icon" [class]="item.icon"></i>
              <span class="p-megamenu-item-link-label p-megamenu-subitem-link-label">{{item.label}}</span>
            </a>
          }
        </ng-template>
      </p-megamenu>
    </div>
  `,
  styles: `
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      .p-megamenu-vertical {
        height: 100%;
        min-width: 100%;
        max-width: 100%;
        width: 100%;
        padding: 0;
        border: 0;
        gap: .25rem;
        .p-megamenu-item-link {
          padding: .5rem 0;
          flex-flow: column;
          gap: .25rem;
          &-icon {
            font-size: 2rem;
            color: var(--p-megamenu-item-icon-color);
          }
          &-label {
            font-size: .5rem;
            color: var(--p-megamenu-item-icon-color);
          }
          &-submenu {
            position: absolute;
            right: 0;
            margin-top: .75rem;
            color: var(--p-megamenu-item-icon-color);
          }
        }
        .p-megamenu-subitem-link {
          flex-flow: row;
          padding: .5rem 1rem;
          gap: .5rem;
          &-label {
            font-size: 1rem;
            color: var(--p-megamenu-item-icon-color);
          }
        }
      }
    }
  `,
})
export class LayoutMegaMenu {

  navigator = inject(Navigator);
  // megamenu level 1 - module
  items = this.navigator.items().map<MegaMenuItem>((item) => ({
    id: item.id,
    icon: item.icon,
    label: item.label,
    title: item.label,
    tooltip: item.tooltip,
    root: true,
    // sub menu level 2 - group
    items: item.items?.map<MenuItem[]>((subitem) => [{
      id: subitem.id,
      icon: subitem.icon,
      label: subitem.label,
      title: subitem.label,
      routerLink: subitem.routerLink,
      routerLinkActiveOptions: subitem.routerLinkActiveOptions,
      // sub menu level 3 - page
      items: subitem.items,
    }])
  }));

}