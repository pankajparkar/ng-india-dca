import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlinkDirective } from '../directives/blink.directive';
import { BoldDirective } from '../directives/bold.directive';

@Component({
  selector: 'app-simple-card',
  standalone: true,
  imports: [CommonModule],
  hostDirectives: [
    {
      directive: BlinkDirective,
      inputs: ['theme: bannerTheme'],
      outputs: ['elementClick: bannerClick'],
    },
    BoldDirective,
  ],
  template: `
    <div class="card">
      <div class="header">
          <p>The Header</p>
      </div>
      <div class="container">
          <p>Some random texts</p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      width: 30%;
      display: flex;
      flex-direction: column;
      border: 1px red solid;
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
  `]
})
export class SimpleCardComponent { }
