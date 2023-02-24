import { Component } from '@angular/core';
import { SimpleCardComponent } from 'src/app/simple-card/simple-card.component';

@Component({
  selector: 'app-composition',
  standalone: true,
  imports: [
    SimpleCardComponent
  ],
  template: `
    <app-simple-card
      bannerTheme="'black'"
      (bannerClick)="bannerClick($event)">
    </app-simple-card>
  `,
})
export class CompositionComponent {
  bannerClick(event: MouseEvent) {
    console.log(event);
  }
}
