import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Servicios } from '../componentes-comunes/services/servicios.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  hide = true;
  registro: FormGroup;

  constructor(private services: Servicios,
    private router: Router,
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
    //  console.log({ user });
      console.log('Cuenta creado con Exito');
      //codigo a ejecutar si funciona 
      Swal.fire({
        titleText: `Su cuenta se ha creado, confirme su cuenta de Correo para continuar.`,
        icon: 'success',
        showCloseButton: true,
        showConfirmButton: false
      });
      this.services.forcedNavigate(['/login']);
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
