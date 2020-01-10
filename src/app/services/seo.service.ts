import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private titleService: Title,
    private metaTagService: Meta) { }

  public setTitle(title: string): void {
      this.titleService.setTitle(title);
  }

  public setMetaDescription(description: string): void {
    this.metaTagService.updateTag({ name: 'description', content: description });
  }

  public setTitleAndDescription(title: string, description?: string): void {
    this.setTitle(title);
    if(description) {
      this.setMetaDescription(description);
    }
  }
}
