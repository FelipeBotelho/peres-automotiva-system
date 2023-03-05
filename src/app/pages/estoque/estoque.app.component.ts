import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'estoque-app-root',
  template: '<router-outlet></router-outlet>',
})
export class EstoqueAppComponent {
  // constructor(private router: Router){
  //   this.router.navigate(['/estoque/consultar-estoque']);
  // }
}
