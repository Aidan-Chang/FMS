import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs'
import { Navigator } from '@fms/svc/core';

@Component({
  selector: 'f-Layout-TabMenu',
  imports: [TabsModule],
  template: `
      <div class="container">
        <p-tabs>
          <p-tablist>
          </p-tablist>
          <p-tabpanels>
          </p-tabpanels>
        </p-tabs>
      </div>
    `,
  styles: `
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        .p-tabs {
          height: 100%;
          width: 100%;
        }
      }
    `,
})
export class LayoutTabMenu {

  navigator = inject(Navigator);
  items = this.navigator.items;

}