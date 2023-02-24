import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "./menu/menu.component";
import { MenuItemComponent } from './menu/menu-item.component';

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  template: `
    <my-menu>
      <my-menu-item>Tes M</my-menu-item>
      <my-menu-item>Tes M</my-menu-item>
      <my-menu-item>Tes M</my-menu-item>
    </my-menu>
  `,
  imports: [MenuItemComponent, MenuComponent]
})
export class CustomMenuComponent {

}
