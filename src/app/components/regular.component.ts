import { Component } from '@angular/core';
import { SimpleCardComponent } from 'src/app/components/simple-card.component';
import { NgxMultiselectModule } from '../multliselect/multiselect.module';

@Component({
  selector: 'app-regular',
  standalone: true,
  imports: [
    SimpleCardComponent,
    NgxMultiselectModule,
  ],
  template: `
    <app-simple-card appBlink appBold></app-simple-card>
    
  `,
})
export class RegularComponent {

}
