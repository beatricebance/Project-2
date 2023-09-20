import { Injectable, Renderer2, RendererFactory2} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ExportDrawingService {
  renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
   this.renderer = rendererFactory.createRenderer(null, null);
  }

  /* inspire by https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg*/

  generateLink(fileName: string, data: string): HTMLAnchorElement  {
    const link: HTMLAnchorElement = this.renderer.createElement('a');
    link.download = fileName;
    link.href = data;
    return link;
  }

  exportPNG(fileName: string, urlpng: string): void {
    this.generateLink(fileName + '.png', urlpng).click();
  }
  exportJpeg(fileName: string, urljpeg: string): void {
    this.generateLink(fileName + '.jpeg', urljpeg).click();
  }
}
