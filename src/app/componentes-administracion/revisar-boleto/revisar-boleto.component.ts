import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-revisar-boleto',
  templateUrl: './revisar-boleto.component.html',
  styleUrls: ['./revisar-boleto.component.scss']
})
export class RevisarBoletoComponent implements OnInit {
  busquedaBoleto: FormGroup;
  cancelacionForm: FormGroup;
  boleto: any;
  busqueda: boolean = false;
  roles: any;
  loaded: boolean = false;
  msg = '';
  constructor(private _formBuilder: FormBuilder,
    private services: Servicios,
    private spinner: NgxSpinnerService) {
    this.busquedaBoleto = this._formBuilder.group({
      noBoleto: ['', Validators.required],
    });
    this.cancelacionForm = this._formBuilder.group({
      motivo: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.roles = (JSON.parse(localStorage.getItem('formDataFilter')));
    if (this.roles.BASE_ROL == '' || this.roles.BASE_ROL != 'Admin') {
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
      this.loaded = true;
    }
  }


  async buscarBoleto() {
    this.spinner.show();
    const boleto = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'boleto/info/vuelo/' + this.busquedaBoleto.value.noBoleto).toPromise().then(res => {
      console.log(res);
      this.boleto = res;
      if (this.boleto == null) {
        this.busqueda = false;
        Swal.fire({
          titleText: `El boleto "${this.busquedaBoleto.value.noBoleto}" no está registrado para vuelos.`,
          icon: 'warning',
          showCloseButton: true,
          showConfirmButton: false
        });
        this.busquedaBoleto.get('noBoleto').setValue('');
        this.spinner.hide();
      } else {
        this.busqueda = true;
        this.spinner.hide();
      }
    });
    this.spinner.hide();
  }


  limpiar() {
    this.busquedaBoleto.get('noBoleto').setValue('');
    this.cancelacionForm.get('motivo').setValue('');
    this.busqueda = false;
  }

  guardarBoleto() {
    this.spinner.show();
    const boleto: any = {
      presentacion: true,
      estadoBoleto: 13
    };
    this.services.putData(this.services.BASE_URL_AEROPUERTO, `boleto/actualizar/${(this.boleto.idBoleto)}`, boleto).toPromise().then(res => {
      console.log(res);
      Swal.fire({
        titleText: 'La información se ha guardado con éxito.',
        icon: 'success',
        showCloseButton: true,
        showConfirmButton: false
      });
      this.limpiar();
      this.spinner.hide();
    }).catch(err => {
      console.log(err);
      Swal.fire({
        titleText: 'Error al registrar datos, por favor intente en otro momento',
        icon: 'error',
        showCloseButton: true,
        showConfirmButton: false
      });
    });
    this.spinner.hide();
  }

}
