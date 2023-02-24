import { Component } from '@angular/core';
import { CdkMenuItem, CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'my-menu-item',
  standalone: true,
  imports: [],
  hostDirectives: [CdkMenuItem],
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      padding: 5px;
      border: 0.5px solid gray;
    }
  `]
})
export class MenuItemComponent { }
