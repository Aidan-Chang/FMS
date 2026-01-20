import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  imports: [
    ToolbarModule,
    ButtonModule,
    FileUploadModule,
  ],
  template: `
    <div class="container">
      <p-toolbar>
        <ng-template #start>
          Path: {{data().path}}
        </ng-template>
        <ng-template #center>
        </ng-template>
        <ng-template #end>
        </ng-template>
      </p-toolbar>
      <div class="container-content">
      </div>
      <div class="container-capture">
        <p-fileupload mode="basic" chooseIcon="pi pi-camera" chooseLabel="Capture" [auto]="true" accept="image/*" styleClass="container-capture-button" />
      </div>
    </div>
  `,
  styles: `
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      &-content {
        flex: 1;
      }
      &-capture {
        position: absolute;
        bottom: 6rem;
        right: 2rem;
        &-button {
          width: 6rem;
          height: 6rem;
          flex-direction: column;
          border-radius: 3rem;
          gap:0;
          > i {
            font-size: 2.5rem;
          }
          > span {
            font-size: .75rem;
          }
        }
      }
    }
  `
})
export class Capture implements AfterViewInit {

  api = inject(HttpClient);
  data = signal<any>({});

  ngAfterViewInit(): void {
    this.api.get('/api/tqm/track/capture/GetList').subscribe(data => {
      this.data.set(data);
    })
  }

}