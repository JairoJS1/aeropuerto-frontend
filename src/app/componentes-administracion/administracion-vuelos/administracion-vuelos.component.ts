import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import Swal from 'sweetalert2';
import { sortAndDeduplicateDiagnostics } from 'typescript/lib/tsserverlibrary';

@Component({
  selector: 'app-administracion-vuelos',
  templateUrl: './administracion-vuelos.component.html',
  styleUrls: ['./administracion-vuelos.component.scss']
})
export class AdministracionVuelosComponent implements OnInit {

  actualizarForm: FormGroup;
  vuelo: any;
  aviones: any;
  escalas: any;
  puertas: any;
  destinos: any;
  origenes: any;
  estados: any;
  actualizar: boolean = false;

  headerColumnNames: string[] = ['numeroVuelo', 'horaSalida', 'origen', 'horaLlegada', 'destino', 'avion', 'puerta', 'escala', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('close') close: any;
  constructor(
    private spinner: NgxSpinnerService,
    private services: Servicios,
    private _formBuilder: FormBuilder) {
    this.actualizarForm = this._formBuilder.group({

      numeroVuelo: [null, Validators.required],
      horaSalida: [null, Validators.required],
      horaLlegada: [null, Validators.required],
      destino: [null, Validators.required],
      origen: [null, Validators.required],
      idAvion: [null, Validators.required],
      idPuerta: [null, Validators.required],
      idEscala: [null, Validators.required],
      estado: [null, Validators.required]
    });
  }

  async ngOnInit() {
    this.obtenerVuelos();
  }

  async obtenerVuelos()  {
    this.spinner.show();
    //catalogo para moestrar datos
    this.services.getData<any[]>(this.services.BASE_URL_AEROPUERTO, 'vuelo/obtener/todas').toPromise().then(async res => {
      this.estados = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/4').toPromise();
      this.destinos = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/10').toPromise();
      this.origenes = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/9').toPromise();
      this.aviones = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'aviones/obtener/todos').toPromise();
      this.puertas = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'puertas/obtener/todas').toPromise();
      this.escalas = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'escalas/obtener/todas').toPromise();
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.spinner.hide();
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    })
  }

  limpiar() {
    this.actualizarForm.reset();
    this.actualizar = false;
    this.actualizarForm.get('numeroVuelo').enable();
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  public guardarVuelo() {
    this.spinner.show();
    try {
      if (!this.actualizar) {
        // cualquiernombre
        const crearVuelo: any = {
          //nombre del swagger
          //datos para guardar
          numeroVuelo: this.actualizarForm.get('numeroVuelo').value,
          horaLlegada: this.actualizarForm.get('horaLlegada').value,
          horaSalida: this.actualizarForm.get('horaSalida').value,
          destinoVuelo: this.actualizarForm.get('destino').value,
          origenVuelo: this.actualizarForm.get('origen').value,
          idAvion: this.actualizarForm.get('idAvion').value,
          idPuerta: this.actualizarForm.get('idPuerta').value,
          idEscala: this.actualizarForm.get('idEscala').value,
          estadoVuelo: this.actualizarForm.get('estado').value
        }
        console.log(crearVuelo);
        this.services.postData(this.services.BASE_URL_AEROPUERTO, 'vuelo/crear', crearVuelo).toPromise().then(res => {
          console.log(res);
          this.limpiar();
          Swal.fire({
            titleText: `Se ha almacenado la información con éxito.`,
            icon: 'success',
            showCloseButton: true,
            showConfirmButton: false
          });
          this.spinner.hide();
        }).catch(err => {
          console.log(err);
          this.spinner.hide();
          return Swal.fire({
            titleText: `Error al registrar datos, por favor intente en otro momento.`,
            icon: 'error',
            showCloseButton: true,
            showConfirmButton: false
          });
        }).finally(() => {
          this.services.forcedNavigate(['/administracion-vuelos']);
        })

      } else {
        const actualizarVuelo: any = {
          numeroVuelo: this.actualizarForm.get('numeroVuelo').value,
          horaLlegada: this.actualizarForm.get('horaLlegada').value,
          horaSalida: this.actualizarForm.get('horaSalida').value,
          destinoVuelo: this.actualizarForm.get('destino').value,
          origenVuelo: this.actualizarForm.get('origen').value,
          idAvion: this.actualizarForm.get('idAvion').value,
          idPuerta: this.actualizarForm.get('idPuerta').value,
          idEscala: this.actualizarForm.get('idEscala').value,
          estadoVuelo: this.actualizarForm.get('estado').value
        }
        this.services.putData(this.services.BASE_URL_AEROPUERTO, `vuelo/actualizar/${(this.vuelo.numero_vuelo)}`, actualizarVuelo).toPromise().then(res => {
          console.log(res);
          this.spinner.hide();
          this.limpiar();
          Swal.fire({
            titleText: `Se ha almacenado la información con éxito.`,
            icon: 'success',
            showCloseButton: true,
            showConfirmButton: false
          });
        }).catch(err => {
          console.log(err);
          this.spinner.hide();
        }).finally(() => {
          this.services.forcedNavigate(['/administracion-vuelos']);
        })
      }

    } catch (error) {
      console.log(error);
      this.spinner.hide();
      return Swal.fire({
        titleText: `Error al registrar datos, por favor intente en otro momento.`,
        icon: 'error',
        showCloseButton: true,
        showConfirmButton: false
      });
    }

  }

  async actualizarVuelo (vuelo: any) {
    this.vuelo = vuelo;
    this.actualizar = true;
    //variables linea 39
    //variables swagger
    this.actualizarForm.get('numeroVuelo').setValue(vuelo?.numero_vuelo);
    this.actualizarForm.get('horaLlegada').setValue(vuelo?.hora_llegada);
    this.actualizarForm.get('horaSalida').setValue(vuelo?.hora_salida);
    this.actualizarForm.get('destino').setValue(vuelo?.destino);
    this.actualizarForm.get('origen').setValue(vuelo.origen);
    this.actualizarForm.get('idAvion').setValue(vuelo?.id_avion);
    this.actualizarForm.get('idPuerta').setValue(vuelo?.id_puerta);
    this.actualizarForm.get('idEscala').setValue(vuelo?.id_escala);
    this.actualizarForm.get('estado').setValue(vuelo?.estado_vuelo);

  }

  eliminarVuelo(eliminar: any) {
    this.actualizarVuelo(eliminar);
    Swal.fire({
      titleText: "Confirmar Eliminación",
      text: `¿Está seguro que desea eliminar Empleado?`,
      icon: 'question',
      showDenyButton: true,
      confirmButtonColor: "#1369A0",
      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
      denyButtonColor: "#F44336",
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then(async res => {
      if (res.isConfirmed) {
        this.spinner.show();
        try {
          const eliminarVuelo: any = {
            //linea91
            numeroVuelo: this.actualizarForm.get('numeroVuelo').value,
            horaLlegada: this.actualizarForm.get('horaLlegada').value,
            horaSalida: this.actualizarForm.get('horaSalida').value,
            destinoVuelo: this.actualizarForm.get('destino').value,
            origenVuelo: this.actualizarForm.get('origen').value,
            idAvion: this.actualizarForm.get('idAvion').value,
            idPuerta: this.actualizarForm.get('idPuerta').value,
            idEscala: this.actualizarForm.get('idEscala').value,
            estadoVuelo: this.actualizarForm.get('estado').value
          }
          this.services.putData(this.services.BASE_URL_AEROPUERTO, `vuelo/actualizar/${(this.vuelo.numero_vuelo)}`, eliminarVuelo).toPromise().then(res => {
            console.log(res);
            this.spinner.hide();
            this.limpiar();
            Swal.fire({
              titleText: `Se ha almacenado la información con éxito.`,
              icon: 'success',
              showCloseButton: true,
              showConfirmButton: false
            });
          }).catch(err => {
            console.log(err);
            this.spinner.hide();
          }).finally(() => {
            this.services.forcedNavigate(['/administracion-vuelos']);
          })
        } catch (error) {
          console.log(error);
          this.spinner.hide();
          return Swal.fire({
            titleText: `Error al registrar datos, por favor intente en otro momento.`,
            icon: 'error',
            showCloseButton: true,
            showConfirmButton: false
          });
        }
      }
    });


  }

}
