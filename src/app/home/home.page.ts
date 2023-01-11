import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { CameraPreview } from '@capacitor-community/camera-preview';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('canvas')
  private canvas?: ElementRef<HTMLCanvasElement>;
  private canvas2dContext?: CanvasRenderingContext2D;

  constructor() {
    console.log('start');
  }

  ngAfterViewInit(): void {
    this.canvas!.nativeElement.width = window.innerWidth;
    this.canvas!.nativeElement.height = window.innerHeight;
    this.canvas2dContext = this.canvas!.nativeElement.getContext('2d')!;

    CameraPreview.start({
      position: 'rear',
      toBack: true,
    }).finally(() =>
      (async () => {
        while (true) {
          await this.grabFrame().catch((e) => console.error(e));
        }
      })()
    );
  }

  async grabFrame(): Promise<void> {
    console.log('grabFrame');
    const frame = await CameraPreview.captureSample({});
    const imgElement = new Image();
    await new Promise((resolve: (arg: void) => void) => {
      imgElement.onload = () => resolve();
      imgElement.src = `data:image/jpg;base64,${frame.value}`;
    });
    this.canvas2dContext!.drawImage(
      imgElement,
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    console.log(`width: ${imgElement.width}, height: ${imgElement.height}`);
  }
}
