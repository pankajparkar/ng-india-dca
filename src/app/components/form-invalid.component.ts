import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvalidFieldFocusDirective } from '../directives/invalid-field-focus.directive';

@Component({
  selector: 'app-form-invalid',
  standalone: true,
  imports: [
    FormsModule,
  ],
  hostDirectives: [InvalidFieldFocusDirective],
  template: `
    <form name="userForm" ngForm #myForm="ngForm" (ngSubmit)="submit()">
      <div class="form-control">
        <label>First Name:</label>
        <input type="text" name="firstName" [(ngModel)]="user.firstName" required>
      </div>
      <div class="form-control">
        <label>Middle Name:</label>
        <input type="text" name="middleName" [(ngModel)]="user.middleName" required>
      </div>
      <div class="form-control">
        <label>Last Name:</label>
        <input type="text" name="lastName" [(ngModel)]="user.lastName" required>
      </div>
      <div class="form-control">
        <label>Age:</label>
        <input type="text" name="age" [(ngModel)]="user.age" required>
      </div>
      <div class="form-control">
        <label>Hobbies:</label>
        <input type="text" name="hobbies" [(ngModel)]="user.hobbies" required>
      </div>
      <div class="form-control">
        <label>Street Address 1:</label>
        <input type="text" name="streetAddress" [(ngModel)]="user.streetAddress1" required>
      </div>
      <div class="form-control">
        <label>Street Address 2:</label>
        <input type="text" name="streetAddress" [(ngModel)]="user.streetAddress2" required>
      </div>
      <div class="form-control">
        <label>City:</label>
        <input type="text" name="city" [(ngModel)]="user.city" required>
      </div>
      <div class="form-control">
        <label>State:</label>
        <input type="text" name="state" [(ngModel)]="user.state" required>
      </div>
      <div class="form-control">
        <label>Country:</label>
        <input type="text" name="country" [(ngModel)]="user.country" required>
      </div>
      <div class="form-control">
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" [(ngModel)]="user.phoneNumber" required>
      </div>
      <div class="form-control">
        <label>Landline:</label>
        <input type="text" name="landline" [(ngModel)]="user.landline" required>
      </div>
      <div class="form-control">
        <label>Language:</label>
        <input type="text" name="language" [(ngModel)]="user.language" required>
      </div>
      <div class="form-control">
        <label>Bio:</label>
        <input type="text" name="bio" [(ngModel)]="user.bio" required>
      </div>
      <div class="form-control">
        <button type="submit" [disabled]="!myForm.valid">Submit</button>
      </div>
    </form>
  `,
  styles: [`
    .form-control {
      display: flex;
      flex-flow: column;
      padding: 10px;
      font-size: 20px;
      max-width: 240px;
    }
  `]
})
export class FormInvalidComponent {
  user = {
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    hobbies: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    country: '',
    phoneNumber: '',
    landline: '',
    language: '',
    bio: '',
  };

  submit() {
  }
}
