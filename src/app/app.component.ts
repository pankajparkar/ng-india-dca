import { Component } from '@angular/core';
import { SimpleCardComponent } from './simple-card/simple-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    SimpleCardComponent,
  ]
})
export class AppComponent {
  title = 'ng-india-dca';
}
