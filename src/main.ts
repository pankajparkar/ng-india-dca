import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { CompositionComponent } from './app/components/composition.component';
import { CustomMenuComponent } from './app/components/custom-menu.component';
import { FormInvalidComponent } from './app/components/form-invalid.component';
import { RegularComponent } from './app/components/regular.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { TestingComponent } from './app/components/testing.component';

const routes: Routes = [
  { path: 'regular', component: RegularComponent },
  { path: 'composition', component: CompositionComponent },
  { path: 'form-invalid', component: FormInvalidComponent },
  { path: 'custom-menu', component: CustomMenuComponent },
  { path: 'testing', component: TestingComponent },
  { path: '**', redirectTo: 'regular' },
]

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(NoopAnimationsModule)
  ],
});