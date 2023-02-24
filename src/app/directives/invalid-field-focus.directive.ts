import { ContentChild, Directive, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appInvalidFieldFocus]',
  standalone: true
})
export class InvalidFieldFocusDirective {

  #destoryed = new Subject<void>();

  @ContentChild('form') forms: any;

  watchInvalidField() {
    console.log(this.forms);
    // this.visoInvalidFieldNavigator.ngSubmit.subscribe(() => {
    //   if (this.visoInvalidFieldNavigator.invalid) {
    //     const invalidFirstElement = this.el.nativeElement.querySelector('.ng-invalid[formcontrolname]')
    //     if (invalidFirstElement) {
    //       invalidFirstElement.scrollIntoView({
    //         behavior: 'smooth'
    //       });
    //     } 
    //   }
    // });
  }

  ngOnInit() {
    this.watchInvalidField();
  }

  ngOnDestroy() {
    this.#destoryed.next();
    this.#destoryed.complete();
  }

}
