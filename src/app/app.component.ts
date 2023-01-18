import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'app';
  constructor() {
    console.log("AppComponent has been initialized to establish router element.");
  }
}
