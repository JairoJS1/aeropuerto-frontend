import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthErrorStrings } from '@aws-amplify/auth';
import { AuthErrorTypes } from '@aws-amplify/auth/lib-esm/types';
import { Auth } from 'aws-amplify';
import { error } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { userInfo } from 'os';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  hide = true;
  registro: FormGroup;

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,) {
    this.registro = this._formBuilder.group({
      user: [null, Validators.required],
      contra: [null, Validators.minLength(8)],
      name: [null, Validators.required],
      email: [null, Validators.email],
      rol: [null, null]
    })

  }

  ngOnInit(): void {
  }

  registrar() {
    try {
      this.spinner.show()
      const user = Auth.signUp({
        username: this.registro.get('user').value,
        password: this.registro.get('contra').value,
        attributes: {
          name: this.registro.get('name').value,
          email: this.registro.get('email').value,
          nickname: "Cliente" //rol para Clientes
        }
      });
      console.log({user});
      console.log('Cuenta creado con Exito');
        //codigo a ejecutar si funciona 
        Swal.fire({
          titleText: `Su cuenta se ha creado, confirme su cuenta de Correo para continuar.`,
          icon: 'success',
          showCloseButton: true,
          showConfirmButton: false
        });
        this.spinner.hide();
    } catch (error) {
      console.log(error);
      this.spinner.hide();
      return Swal.fire({
        titleText: `Error al crear cuenta, usuario ya existe`,
        icon: 'error',
        showCloseButton: true,
        showConfirmButton: false
      });
    }

  }

}
