import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, RequiredValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { Servicios } from '../componentes-comunes/services/servicios.service';
export let GlobalVariable = ({
  BASE_ROL: '',
  //... more of your variables
});
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('roles') roles?: AppComponent | any;
  user: string;
  contra: string;
  hide = true;
  ingreso: FormGroup;
  rol: any;
  loader: boolean = false;

  constructor(private services: Servicios,
    private router: Router,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,) {
    this.ingreso = this._formBuilder.group({
      user: [null, Validators.required],
      contra: [null, Validators.minLength(8)]
    });
    // localStorage.setItem('formDataFilter', JSON.stringify(GlobalVariable));
  }

  ngOnInit(): void {
  }


  async login() {

    try {

      this.spinner.show();
      var user = await Auth.signIn(this.ingreso.get('user').value, this.ingreso.get('contra').value);
      console.log('Auntenticando...');
      var token = user.signInUserSession;
      var nombre = user.attributes.name;
      var rol1 = user.attributes;
      var atributos = user.attributes;
      if (token != null) {
        console.log('Auntenticacion con Exito');
        this.roles = user.attributes.nickname;
        Swal.fire({
          titleText: `Bienvenido ` + nombre,
          icon: 'success',
          showCloseButton: true,
          showConfirmButton: false
        });
        this.spinner.hide();
        GlobalVariable.BASE_ROL = this.roles;
        localStorage.setItem('formDataFilter', JSON.stringify(GlobalVariable));
        this.services.forcedNavigate(['/menu']);
      }
    } catch (error) {
      this.ingreso.reset();
      console.log(error);
      this.spinner.hide();
      return Swal.fire({
        titleText: `Error verifique sus credenciales`,
        icon: 'error',
        showCloseButton: true,
        showConfirmButton: false
      });
    }
  }

}
