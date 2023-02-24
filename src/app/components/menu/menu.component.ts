import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenu } from '@angular/cdk/menu';

@Component({
  selector: 'my-menu',
  standalone: true,
  imports: [],
  hostDirectives: [CdkMenu],
  template: `
    <ng-content></ng-content>
  `,
})
export class MenuComponent { }
