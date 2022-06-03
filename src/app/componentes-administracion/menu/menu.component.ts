import { Component, Inject, Input, OnInit } from '@angular/core';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import { GlobalVariable } from 'src/app/login/login.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input('roles') roles?: any;

  title = 'aeropuerto-frontend';
  obtenerRoles: any;
  obtenerRol2:  any;
  loaded: boolean = false;
  msg = '';
  rolC: string = 'Cliente';
  rolA: string = 'Admin';
  constructor( private services: Servicios) {
  }


  ngOnInit(): void {
    this.obtenerRol2 = (JSON.parse(localStorage.getItem('formDataFilter')));
    if(this.obtenerRol2 == null){
      this.loaded = true;
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
    }else if (this.obtenerRol2.BASE_ROL == '') {
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
      this.loaded = true;
    }
  }

  cerraSesion() {
    GlobalVariable.BASE_ROL = '';
    localStorage.setItem('formDataFilter', JSON.stringify(GlobalVariable));
    this.services.forcedNavigate(['/']);
  }
}
