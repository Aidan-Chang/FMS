import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { FileUploadModule } from 'primeng/fileupload';
import { SpeedDialModule } from 'primeng/speeddial';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MobileScanner } from '@fms/svc/mobile';

@Component({
  imports: [
    FormsModule,
    ToolbarModule,
    ButtonModule,
    FileUploadModule,
    DataViewModule,
    SpeedDialModule,
    ImageModule,
    DialogModule,
    InputTextModule,
    MobileScanner,
  ],
  template: `
    <div class="container">
      <p-toolbar>
        <ng-template #start>
          Path: {{ decode(data().path) }}
        </ng-template>
        <ng-template #center>
        </ng-template>
        <ng-template #end>
        </ng-template>
      </p-toolbar>
      <div class="container-content">
        <p-data-view [value]="data().items" layout="grid">
          <ng-template #grid let-items>
            <div class="container-content-grid">
              @for (item of items; track item.name) {
                @switch (item.type) {
                  @case ('folder') {
                    <a class="container-content-grid-item" (click)="getData(item)">
                      <i class="container-content-grid-item-icon pi pi-folder"></i>
                      <span class="container-content-grid-item-label">{{item.name}}</span>
                    </a>
                  }
                  @case ('file') {
                    <a class="container-content-grid-item">
                      <p-image [src]="'/api/tqm/track/capture/GetFile?path=' + item.path + '&width=768&height=1020'" height="48" preview="true" />
                      <span class="container-content-grid-item-label">{{item.name}}</span>
                    </a>
                  }
                  @default{
                    <a class="container-content-grid-item blank" style="visibility: hidden;"></a>
                  }
                }
              }
            </div>
          </ng-template>
        </p-data-view>
      </div>
      <div class="container-function">
        <p-speeddial [model]="functions" direction="up">
          <ng-template #button let-toggleCallback="toggleCallback">
            <p-button icon="pi pi-bars" label="功能" severity="info" (click)="toggleCallback($event)" />
          </ng-template>
          <ng-template #item let-item let-toggleCallback="toggleCallback">
            <div class="container-function-item" (click)="toggleCallback($event, item)">
              <i [class]="item.icon"></i>
              <span>
                {{item.label}}
              </span>
            </div>
          </ng-template>
        </p-speeddial>
      </div>
      <div class="container-capture">
        <p-fileupload mode="basic" chooseIcon="pi pi-camera" chooseLabel="拍照" auto="true" accept="image/*" customUpload="true" (uploadHandler)="uploadImage($event)" (onUpload)="uploadImageDone($event)" />
      </div>
    </div>
    <p-dialog [modal]="true" [(visible)]="visible" position="top" [style]="{ width: '20rem' }">
      <ng-template #header>
        <div class="dialog-header">
          <i class="pi pi-folder-plus"></i>
          <label>新增資料夾</label>
        </div>
      </ng-template>
      <div class="dialog-content">
        <input type="text" pInputText [(ngModel)]="newFolderName" />
        <div class="dialog-content-scanner">
          @if(visible()) {
            <f-scanner [(state)]="state" [config]="{fps:10,qrbox:{width:224,height:224}}" (value)="newFolderName.set($event);" />
          }
        </div>
      </div>
      <ng-template #footer>
        <div class="dialog-footer">
          <p-button label="重試" [text]="true" severity="secondary" [style.visibility]="state()?'hidden':'visible'" (click)="state.set(true)" />
          <p-button label="取消" [text]="true" severity="danger" (click)="newFolderName.set('');visible.set(false)" />
          <p-button label="確定" [outlined]="true" severity="success" (click)="createFolder()" [disabled]="this.newFolderName().length==0" />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: `
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      &-content {
        flex: 1 0 0;
        overflow-y: scroll;
        &-grid {
          display: grid;
          grid-template-columns: repeat(12,minmax(0,1fr));
          gap: 1rem;
          padding: 1rem;
          &-item {
            grid-column: span 4 / span 4;
            border: solid 1px #ccc;
            border-radius: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: end;
            height: 6rem;
            gap: 0;
            &-icon {
              font-size: 3rem;
            }
            &-label {
              height: 1.5rem;
              font-size: .75rem;
              white-space: nowrap;
              width: 100%;
              text-overflow: ellipsis;
              text-align: center;
              overflow: hidden;
            }
          }
        }
      }
      &-function {
        position: absolute;
        bottom: 5rem;
        left: 1rem;
      }
      &-capture {
        position: absolute;
        bottom: 5rem;
        right: 1rem;
      }
    }
    .dialog {
      &-header {
        width: 100%;
        text-align: center;
        i {
          padding: 0 .25rem;
        }
      }
      &-content {
        text-align: center;
        height: 16.15rem;
        &-scanner {
          width: 15rem;
          height: 15rem;
          border: solid 1px var(--p-fms-color1);
          margin: auto;
          #scanner {
            width: 15rem;
            height: 15rem;
          }
        }
      }
      &-footer {
        width: 100%;
        padding-top: .5rem;
        text-align: right;
      }
    }
  `
})
export class Capture implements AfterViewInit {

  api = inject(HttpClient);
  data = signal<any>({});
  decode = (text: string) => text?.length ? decodeURIComponent(text) : "\\";

  visible = signal(false);
  newFolderName = signal('');
  state = signal(false);

  functions = [
    {
      icon: 'pi pi-arrow-up', label: '上一層', command: () => {
        if (this.data().path?.length)
          this.getData({ path: this.data().parent, type: 'folder' })
      }
    },
    { icon: 'pi pi-folder-plus', label: '新增資料夾', command: () => { this.visible.set(true); } },
  ];

  ngAfterViewInit(): void {
    this.api.post('/api/tqm/track/capture/GetList', { path: '' }).subscribe((data: any) => {
      if (data.items.length > 9) {
        data.items.push({ name: `##1##` }, { name: `##2##` }, { name: `##3##` }, { name: `##4##` }, { name: `##5##` }, { name: `##6##` });
      }
      this.data.set(data);
    });
  }

  getData(item: any): void {
    switch (item.type) {
      case 'folder':
        this.api.post('/api/tqm/track/capture/GetList', { path: item.path }).subscribe(data => {
          this.data.set(data);
          console.log(this.data());
        });
        break;
      case 'file':
        this.api.post('/api/tqm/track/capture/GetImage', { path: item.path }).subscribe(data => {
          console.log(data);
        });
        break;
    }
  }

  uploadImage(event: any) {
    const formData: FormData = new FormData();
    formData.append('path', this.data().path);
    formData.append('file', event.files[0], event.files[0].name);
    this.api.post('/api/tqm/track/capture/SaveImage', formData).subscribe(data => {
      this.api.post('/api/tqm/track/capture/GetList', { path: this.data().path }).subscribe((data: any) => {
        if (data.items.length > 9) {
          data.items.push({ name: `##1##` }, { name: `##2##` }, { name: `##3##` }, { name: `##4##` }, { name: `##5##` }, { name: `##6##` });
        }
        this.data.set(data);
      })
    });
  }

  createFolder() {
    this.api.post('/api/tqm/track/capture/CreateFolder', { path: this.data().path, name: this.newFolderName() }).subscribe((data: any) => {
      this.api.post('/api/tqm/track/capture/GetList', { path: data.path }).subscribe((data: any) => {
        if (data.items.length > 9) {
          data.items.push({ name: `##1##` }, { name: `##2##` }, { name: `##3##` }, { name: `##4##` }, { name: `##5##` }, { name: `##6##` });
        }
        this.data.set(data);
      });
    });
    this.visible.set(false);
  }

  uploadImageDone(event: any) {
    console.log(event);
  }

}