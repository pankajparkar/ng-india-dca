import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { CompositionComponent } from './app/components/composition.component';
import { FormInvalidComponent } from './app/components/form-invalid.component';
import { RegularComponent } from './app/components/regular.component';

const routes: Routes = [
  { path: 'regular', component: RegularComponent },
  { path: 'composition', component: CompositionComponent },
  { path: 'form-invalid', component: FormInvalidComponent },
  { path: '**', redirectTo: 'regular' },
]

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ],
});