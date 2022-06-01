import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-administracion-aviones',
  templateUrl: './administracion-aviones.component.html',
  styleUrls: ['./administracion-aviones.component.scss']
})
export class AdministracionAvionesComponent implements OnInit {

  actualizarForm: FormGroup;
  avion: any;
  actualizar: boolean = false;
  estados: any;
  aerolineas: any;
  key: any;
  teclado: any;
  numero: any;
  especiales: any;
  teclado_especial: boolean;
  roles: any;
  loaded: boolean = false;
  msg = '';

  headerColumnNames: string[] = ['numeroAvion', 'modelo', 'anio', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('close') close: any;


  constructor(
    private spinner: NgxSpinnerService,
    private services: Servicios,
    private _formBuilder: FormBuilder
  ) {
    this.actualizarForm = this._formBuilder.group({
      numeroAvion: [null, Validators.required],
      modelo: [null, Validators.required],
      anio: [null, Validators.required],
      aerolinea: [null, Validators.required],
      estadoAvion: [null, Validators.required]
    });
  }

  async ngOnInit() {
    this.roles = (JSON.parse(localStorage.getItem('formDataFilter')));
    if (this.roles.BASE_ROL == '' || this.roles.BASE_ROL != 'Admin') {
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
      this.loaded = true;
    }else{
      this.loaded = false;
      this.obtenerAviones();
    }
   
  }

  async obtenerAviones() {
    this.spinner.show();
    this.services.getData<any[]>(this.services.BASE_URL_AEROPUERTO, 'aviones/obtener/todos').toPromise().then(async res => {
      this.estados = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/aviones').toPromise();
      this.aerolineas = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'aerolinea/obtener/todas').toPromise();
      console.log(this.estados, this.aerolineas)
      console.log(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.spinner.hide();
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    })
  }
  /* Metodo para limpiar campos */
  limpiar() {
    this.actualizarForm.reset();
    this.actualizar = false;
    this.avion = null;
    this.actualizarForm.get('numeroAvion').enable();
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*
   * Metodo para guardar un avion
   */
  public guardarAvion() {
    this.spinner.show();
    try {
      if (!this.actualizar) {
        const crearAvion: any = {
          idAvion: this.actualizarForm.get('numeroAvion').value,
          modeloAvion: this.actualizarForm.get('modelo').value,
          anioAvion: this.actualizarForm.get('anio').value,
          estadoAvion: this.actualizarForm.get('estadoAvion').value,
          idAerolinea: this.actualizarForm.get('aerolinea').value
        }
        console.log(crearAvion);
        this.services.postData(this.services.BASE_URL_AEROPUERTO, 'aviones/crear', crearAvion).toPromise().then(res => {
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
          this.services.forcedNavigate(['/administracion-aviones']);
        })

      } else {
        const actulizarAvion: any = {
          modeloAvion: this.actualizarForm.get('modelo').value,
          anioAvion: this.actualizarForm.get('anio').value,
          estadoAvion: this.actualizarForm.get('estadoAvion').value,
          idAerolinea: this.actualizarForm.get('aerolinea').value,
        }
        console.log(actulizarAvion);
        console.log(this.avion.id_Avion);
        this.services.putData(this.services.BASE_URL_AEROPUERTO, `aviones/actulizar/${(this.avion.id_Avion)}`, actulizarAvion).toPromise().then(res => {
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
          this.services.forcedNavigate(['/administracion-aviones']);
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


  /*
  *Metodo para actualizar un avion
   */
  async actualizarAvion(avion: any) {
    this.avion = avion;
    this.actualizar = true;
    console.log(avion);
    this.actualizarForm.get('numeroAvion').setValue(avion?.id_Avion);
    this.actualizarForm.get('modelo').setValue(avion?.modelo);
    this.actualizarForm.get('anio').setValue(avion?.anio);
    this.actualizarForm.get('aerolinea').setValue(avion?.aerolinea);
    this.actualizarForm.get('estadoAvion').setValue(avion?.estado_Avion);
    this.actualizarForm.get('numeroAvion').disable();
  }

  eliminarAvion(eliminar: any) {
    this.actualizarAvion(eliminar);
    Swal.fire({
      titleText: "Confirmar Eliminación",
      text: `¿Está seguro que desea eliminar este avion?`,
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
          const eliminarAvion: any = {
            modeloAvion: this.actualizarForm.get('modelo').value,
            anioAvion: this.actualizarForm.get('anio').value,
            estadoAvion: 44,
            idAerolinea: this.actualizarForm.get('aerolinea').value,
          }
          console.log(eliminarAvion);
          console.log(this.avion.id_Avion);
          this.services.putData(this.services.BASE_URL_AEROPUERTO, `aviones/actulizar/${(this.avion.id_Avion)}`, eliminarAvion).toPromise().then(res => {
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
            this.services.forcedNavigate(['/administracion-aviones']);
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



  public anioValidar(e) {
    this.key = e.keyCode || e.which;
    this.teclado = String.fromCharCode(this.key);
    this.especiales = '4';
    this.numero = '0123456789';
    this.teclado_especial = false;

    for (const i in this.especiales) {
      if (this.key === this.especiales[i]) {
        this.teclado_especial = true;
      }
    }
    if (this.numero.indexOf(this.teclado) === -1 && !this.teclado_especial) {
      return false;
    }
  }
}
