import { Directive, ElementRef, inject, Renderer2, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTestingId]',
  standalone: true,
})
export class TestingIdDirective {
  #el = inject(ElementRef);
  #view = inject(ViewContainerRef);
  #renderer = inject(Renderer2);
  #selectorElement = `test-id-${(this.#view as any)['_lContainer'][0][0].localName}`;

  ngOnInit() {
    this.#renderer.setAttribute(this.#el.nativeElement, 'test-id', this.#selectorElement)
  }
}
