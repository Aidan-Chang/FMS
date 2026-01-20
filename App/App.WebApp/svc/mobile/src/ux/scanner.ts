import { Component, input, output, model, effect } from '@angular/core';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

@Component({
  selector: 'f-scanner',
  template: `
    <div id="scanner" style="width:100%;height:100%;"></div>
  `
})
export class MobileScanner {

  config = input.required<Html5QrcodeCameraScanConfig>();
  state = model.required<boolean>();
  value = output<string>();
  scanner: Html5Qrcode | undefined;

  constructor() {
    setTimeout(() => {
      this.scanner = new Html5Qrcode('scanner');
      this.scanner.start(
        { facingMode: 'environment' },
        this.config(),
        (text, result) => {
          this.value.emit(text);
          this.state.set(false);
        },
        (error) => console.log(error)
      );
      this.state.set(true);
    });
    effect(() => {
      if (this.state()) {
        this.value.emit('');
        this.scanner?.resume();
      } else {
        this.scanner?.pause();
      }
    });
  }

}