import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-boleto',
  templateUrl: './consulta-boleto.component.html',
  styleUrls: ['./consulta-boleto.component.scss']
})
export class ConsultaBoletoComponent implements OnInit {
  busquedaBoleto: FormGroup;
  cancelacionForm: FormGroup;
  boleto: any;
  busqueda: boolean = false;
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


}
