import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { RegularComponent } from './app/components/regular.component';

const routes: Routes = [
  { path: 'regular', component: RegularComponent },
  { path: '**', redirectTo: 'regular' },
]

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ],
});