import { Component, AfterViewInit, inject, effect, viewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { ProgressBarModule } from 'primeng/progressbar';
import { Theming } from '@fms/svc/core';

@Component({
  imports: [
    ProgressBarModule,
  ],
  template: `
    @if(progress) {
      <p-progressbar [value]="progressValue" />
    }
    <div #wrapper class="iframe-wrapper">
      <iframe #iframe [src]="url" (load)="loaded()"></iframe>
    </div>
  `,
  styles: `
    .iframe-wrapper {
      width: 100%;
      height: 100%;
      visibility: hidden;
      > iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
  `
})
export class IFramePage implements AfterViewInit {
  theming = inject(Theming);
  sanitizer: DomSanitizer = inject(DomSanitizer);
  route = inject(ActivatedRoute);
  url: SafeResourceUrl = '';
  style = '';
  wrapper = viewChild.required<ElementRef<HTMLDivElement>>('wrapper');
  iframe = viewChild.required<ElementRef<HTMLIFrameElement>>('iframe');
  progress = false;
  progressValue = 10;
  interval = 0;

  constructor() {
    var data = this.route.snapshot.data;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data['url']);
    this.style = data['style'];
    effect(() => {
      const content = this.iframe().nativeElement.contentDocument;
      if (content) {
        content.body.className = `${this.theming.value()}-mode`;
      }
    });
  }

  ngAfterViewInit(): void {
    this.progress = true;
    this.interval = setInterval(() => {
      if (this.progressValue > 99) {
        this.progressValue = 99;
      } else {
        this.progressValue += 10;
      }
    }, 100);
  }

  loaded(): void {
    const content = this.iframe().nativeElement.contentDocument;
    if (content) {
      content.body.className = `${this.theming.value()}-mode`;
    }
    if (this.style) {
      const doc = this.iframe().nativeElement.contentDocument;
      if (doc) {
        const styleElement = doc.createElement('style');
        styleElement.textContent = this.style;
        doc.head.append(styleElement);
      }
    }
    this.progress = false;
    clearInterval(this.interval);
    this.wrapper().nativeElement.style.visibility = 'visible';
  }

}