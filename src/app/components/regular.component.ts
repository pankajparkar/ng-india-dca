import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleCardComponent } from 'src/app/simple-card/simple-card.component';

@Component({
  selector: 'app-regular',
  standalone: true,
  imports: [
    SimpleCardComponent,
  ],
  template: `
    <app-simple-card appBlink appBold></app-simple-card>
  `,
})
export class RegularComponent {

}
