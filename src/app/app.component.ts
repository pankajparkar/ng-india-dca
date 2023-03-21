import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlinkDirective } from './directives/blink.directive';
import { BoldDirective } from './directives/bold.directive';
import { SimpleCardComponent } from './components/simple-card.component';
import { NavbarComponent } from "./components/navbar.component";
import { NgxMultiselectModule } from './multliselect/multiselect.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <p>Select your favourite teams from the following:</p>
    <ngx-multiselect
      [formControl]="selectedOptions"
      ngDefaultControl
      [options]="options">
    </ngx-multiselect>
    <!-- <router-outlet></router-outlet> -->
  `,
  imports: [
    SimpleCardComponent,
    RouterOutlet,
    BlinkDirective,
    BoldDirective,
    NavbarComponent,
    ReactiveFormsModule,
    NgxMultiselectModule,
  ]
})
export class AppComponent {
  options = [
    { "id": 1, "name": "Manchester United" },
    { "id": 2, "name": "Liverpool F.C." },
    { "id": 3, "name": "Chelsea F.C." },
    { "id": 4, "name": "Arsenal F.C." },
    { "id": 5, "name": "FC Barcelona" }
  ];
  selectedOptions = new FormControl([
    { "id": 2, "name": "Liverpool F.C." },
    { "id": 3, "name": "Chelsea F.C." }
  ]);
}
