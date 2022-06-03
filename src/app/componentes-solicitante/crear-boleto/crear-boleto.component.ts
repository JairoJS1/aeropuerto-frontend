import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Boleto } from 'src/app/componentes-comunes/classes/Boleto.class';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import Swal from 'sweetalert2';
import { PlantillaBoletoComponent } from '../plantilla-boleto/plantilla-boleto.component';


declare var $: any;
@Component({
  selector: 'app-crear-boleto',
  templateUrl: './crear-boleto.component.html',
  styleUrls: ['./crear-boleto.component.scss']
})
export class CrearBoletoComponent implements OnInit {
  boleto2?: Boleto;
  @ViewChild('registroForm') registroForm?: PlantillaBoletoComponent | any;

  reserva = { sesion: {}, asientos: [] };
  sesiones: any
  usuarioForm: FormGroup;
  vueloForm: FormGroup;
  boletoForm: FormGroup;
  listDestino: any = [];
  listOrigen: any = [];
  pasaporte: any;
  myControl = new FormControl();
  destino: boolean = false;
  vuelo: any = [];
  crearBoleto: any;
  asientosDisponibles: any;
  comentarios: any;
  node: boolean = false;
  asiento: boolean = false;
  roles: any;
  loaded: boolean = false;
  msg = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('close') close;
  @Inject('obtenerRol') GlobalVariable: any

  constructor(
    private services: Servicios,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,

  ) {
    this.usuarioForm = this.formBuilder.group({
      numeroAsiento: ['', Validators.required],/** */
    });
    this.boletoForm = this.formBuilder.group({
      numeroPasaporte: ['', Validators.required],
      nombrePasajero: ['', Validators.required],
      apellidoPasajero: ['', Validators.required],
      origenVuelo: ['', Validators.required],
      destinoVuelo: ['', Validators.required],
      numeroVuelo: ['',],
      horaSalida: [''],
      horaLlegada: ['']
    });
  }

  async ngOnInit() {
    this.roles = (JSON.parse(localStorage.getItem('formDataFilter')));
    if(this.roles == null){
      this.loaded = true;
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
    }else if (this.roles.BASE_ROL == '' || this.roles.BASE_ROL != 'Cliente') { 
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
      this.loaded = true;
    }else{
      this.loaded = false;
      this.listDestino = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/10').toPromise();
      this.listOrigen = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/9').toPromise();
    }
  }

  buscarUsuario(numeroPasaporte) {
    this.spinner.show();
    this.services.getData(this.services.BASE_URL_AEROPUERTO, `pasajero/obtener/${numeroPasaporte}`).toPromise().then(res => {
      this.pasaporte = res;
      if (this.pasaporte !== null) {
        this.boletoForm.get("nombrePasajero").setValue(this.pasaporte.nombrePasajero);
        this.boletoForm.get("apellidoPasajero").setValue(this.pasaporte.apellidoPasajero);
      } else {
        this.boletoForm.get("nombrePasajero").setValue("");
        this.boletoForm.get("apellidoPasajero").setValue("");
      }
      this.spinner.hide();
    });

  }

  limpiar() {
    this.usuarioForm.reset();
    this.boletoForm.reset();
    this.services.forcedNavigate(['/crear-boleto']);
  }



  buscarVuelo() {
    const origen = this.boletoForm.get("origenVuelo").value;
    const destino = this.boletoForm.get("destinoVuelo").value;
    this.spinner.show();
    this.services.getData(this.services.BASE_URL_AEROPUERTO, `vuelo/obtener/origen/destino/${origen}/${destino}`).toPromise().then(res => {
      console.log(res);
      this.vuelo = res;
      if (this.vuelo.length <= 0) {
        Swal.fire({
          titleText: `No se ha encontrado ningun vuelo disponible`,
          icon: 'warning',
          showCloseButton: true,
          showConfirmButton: false
        });
        this.destino = false;
        this.boletoForm.get("origenVuelo").setValue("");
        this.boletoForm.get("destinoVuelo").setValue("");
      } else {
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.spinner.hide();
    });
  }


  async enviarBoleto() {
    this.spinner.show();
    const numeroPasaporte = this.boletoForm.get("numeroPasaporte").value;
    const nombrePasajero = this.boletoForm.get("nombrePasajero").value;
    const apellidoPasajero = this.boletoForm.get("apellidoPasajero").value;
    const fechaCreacion = moment().format('YYYY-MM-DD');
    const numeroAsiento = this.usuarioForm.get("numeroAsiento").value;
    const numeroVuelo = this.boletoForm.get("numeroVuelo").value;
    const asientos = JSON.stringify(this.reserva.asientos);

    const boleto: any = {
      numeroPasaporte: numeroPasaporte,
      nombrePasajero: nombrePasajero,
      apellidoPasajero: apellidoPasajero,
      fechaCreacion: fechaCreacion,
      numeroAsiento: numeroAsiento,
      numeroVuelo: numeroVuelo,
      asientos: asientos
    }
    console.log(boleto);
    this.services.postData(this.services.BASE_URL_AEROPUERTO, 'boleto/crear', boleto).toPromise().then(async res => {
      console.log(res);
      this.crearBoleto = res;
      Swal.fire({
        titleText: `Se ha creado su boleto exitosamente`,
        icon: 'success',
        showCloseButton: true,
        showConfirmButton: false
      });
      await this.generarBoleto();
    }).catch(err => {
      console.log(err);
      Swal.fire({
        titleText: `Error al registrar datos, por favor intente en otro momento`,
        icon: 'error',
        showCloseButton: true,
        showConfirmButton: false
      });
      this.spinner.hide();
    }).finally(() => {

      this.spinner.hide();
    });
  }

  async generarBoleto() {
    Swal.fire({
      title: "Generando Boleto",
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    const boleto = this.boletoForm.value;
    const usuario = this.usuarioForm.value;
    console.log(boleto.nombrePasajero + " " + boleto.apellidoPasajero);

    this.boleto2 = await this.services.getData<Boleto>(this.services.BASE_URL_AEROPUERTO, `boleto/info/${this.crearBoleto.idBoleto}`).toPromise();

    this.boleto2.nombrePasajero = boleto.nombrePasajero + " " + boleto.apellidoPasajero;
    this.boleto2.numeroVuelo = boleto.numeroVuelo;
    this.boleto2.numeroBoleto = "N-" + this.crearBoleto.idBoleto;
    this.boleto2.numeroBoleto2 = boleto.numeroVuelo;
    this.boleto2.horaAbordaje = moment(boleto.horaSalida).format('HH:mm');
    this.boleto2.fechaAbordaje = moment(boleto.horaSalida).format('DDMMMM');
    this.boleto2.horaAterrizaje = moment(boleto.horaLlegada).format('HH:mm');
    this.boleto2.origenVuelo = this.boleto2.origenVuelo;
    this.boleto2.destinoVuelo = this.boleto2.destinoVuelo;
    this.boleto2.numeroAsiento = usuario.numeroAsiento;

    setTimeout(() => {
      this.registroForm.onFinished(async () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: false,
          showLoaderOnConfirm: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: "success",
          iconHtml: '<span class="mat-icon notranslate material-icons mat-icon-no-color">upload</span>',
          title: 'Boleto Generado con exito'
        })

      });
      this.registroForm.generar();
      this.limpiar();
      this.services.forcedNavigate(['/crear-boleto']);
    }, 1000)
  }

  getSesiones() {
    const boleto = this.boletoForm.value;
    this.services.getData(this.services.BASE_URL_AEROPUERTO, `vuelo/numeroVuelo/${boleto.numeroVuelo}`).toPromise().then(res => {
      this.asientosDisponibles = res;
      console.log(this.asientosDisponibles);
      this.comentarios = JSON.parse(this.asientosDisponibles.asientos);
      console.log(this.comentarios);
      this.comentarios.forEach(element => {
        const group = element.group;
        const value = element.value;
        this.reserva.asientos.push({ group, value });
      });
    });
  }


  asientoStatus(event) {
    const group = event.path[1].id;
    const nodeSelected = $(`#${event.path[0].id}`);
    const value = nodeSelected[0].innerText;
    this.reserva.asientos.push({ group, value });

    nodeSelected.toggleClass('asientoLibre').toggleClass('asientoOcupado');
    if (nodeSelected.hasClass('asientoOcupado')) {

      if (this.asiento) {
        this.asiento = false;
      } else {
        this.asiento = true;
        this.usuarioForm.get("numeroAsiento").setValue(group + value);
      }
    } else {
      if (!this.asiento) {
        this.asiento = true;

      } else {
        this.asiento = false;
      }
    }
    if (nodeSelected.hasClass('asientoLibre')) {
      this.reserva.asientos.forEach(element => {
        if (element.group === group && element.value === value) {
          this.reserva.asientos.splice(this.reserva.asientos.indexOf(element), 1);
          if (this.reserva.asientos.length <= 1) {
            this.reserva.asientos = [];
            this.usuarioForm.get("numeroAsiento").setValue(null);
          }
        }
      });
    }
    console.log(this.reserva.asientos);
    console.log(group, nodeSelected, value);
    console.log(this.usuarioForm.get("numeroAsiento").value);
  }

  elegirVuelo(vuelo) {
    console.log(vuelo);
    this.boletoForm.get("numeroVuelo").setValue(vuelo.numero_vuelo);
    this.boletoForm.get("horaSalida").setValue(vuelo.hora_salida);
    this.boletoForm.get("horaLlegada").setValue(vuelo.hora_llegada);
    this.getSesiones();
  }

  elegirAerolina(event, vuelo) {
    let nodeSelected = $(`#${event.path[0].id}`);
    console.log(event.path[0].id);
    nodeSelected.toggleClass('asientoLibre2').toggleClass('asientoOcupado2');
    if (nodeSelected.hasClass('asientoOcupado2')) {
      console.log("entre");
      if (this.node) {
        this.node = false;
      } else {
        this.node = true;
        this.elegirVuelo(vuelo);
      }
    } else {
      if (!this.node) {
        this.node = true;

      } else {
        this.node = false;
      }

    }
  }

}

