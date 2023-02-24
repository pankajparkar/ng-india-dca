import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "./menu/menu.component";
import { MenuItemComponent } from './menu/menu-item.component';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  template: `
    <button [cdkMenuTriggerFor]="menu" class="example-standalone-trigger">Click me!</button>
    <ng-template #menu>
      <my-menu>
        <my-menu-item>Tes M</my-menu-item>
        <my-menu-item>Tes M</my-menu-item>
        <my-menu-item>Tes M</my-menu-item>
      </my-menu>
    </ng-template>
  `,
  imports: [MenuItemComponent, MenuComponent, CdkMenuTrigger],
  styles: [`
    :host {
      display: block;
      padding: 10px;
    }
  `]
})
export class CustomMenuComponent {

}
