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
  templateUrl: './simple-card.component.html',
  styleUrls: ['./simple-card.component.scss']
})
export class SimpleCardComponent { }
