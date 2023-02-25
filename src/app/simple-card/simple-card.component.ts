import { Component, inject } from '@angular/core';
import { RibbonComponent } from "../components/ribbon/ribbon.component";
import { BoldDirective } from '../directives/bold.directive';
import { BlinkDirective } from '../directives/blink.directive';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simple-card',
  standalone: true,
  template: `
    <div class="card">
      <ng-container *ngIf="isRegular">
        <app-ribbon appBold appBlink/>
      </ng-container>
      <ng-container *ngIf="isComposition">
        <app-ribbon
          bannerTheme="'black'"
          (bannerClick)="bannerClick($event)" />
      </ng-container>
      <div class="header">
          <p>The Header</p>
      </div>
      <div class="container">
          <p>Some random texts</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      padding: 25px;
      display: block;
    }
    .card {
      width: 30%;
      display: flex;
      flex-direction: column;
      border: 1px red solid;
      position: relative;
    }
    .header {
      height: 30%;
      background: red;
      color: white;
      text-align: center;
    }
    .container {
      padding: 2px 16px;
    }
    
  `],
  imports: [
    RibbonComponent,
    BoldDirective,
    BlinkDirective,
    NgIf,
  ]
})
export class SimpleCardComponent {
  router = inject(Router);
  isRegular = this.router.url === '/regular'
  isComposition = this.router.url === '/composition'
  bannerClick(event: MouseEvent) {
    console.log(event);
  }
}
