import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalVariable } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit {

  @Input('roles') roles?: any;
  @Inject('obtenerRol') GlobalVariable: any;

  title = 'aeropuerto-frontend';
  obtenerRoles: any;
  obtenerRol2: any;

  ngOnInit(): void {
    this.obtenerRol2 = (JSON.parse(localStorage.getItem('formDataFilter')));
  }



}
