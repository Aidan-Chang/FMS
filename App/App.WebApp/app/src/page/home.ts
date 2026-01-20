import { Component } from '@angular/core';
import { IconMutate } from '@fms/svc/ux';

@Component({
  imports: [
    IconMutate,
  ],
  template: `
    Home
    <div>
      <i [icon]="'mso folder_code'"></i>
    </div>
    <div>
      <span [icon]="'mso folder_code'"></span>
    </div>
  `
})
export class Home { }