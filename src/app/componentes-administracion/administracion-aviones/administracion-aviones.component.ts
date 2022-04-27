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
  aerolinea: any;
  actualizar: boolean = false;
  estados: any;
  aerolineas: any;

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
    /*     this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 4000); */
    this.obtenerAviones();

  }

  async obtenerAviones() {
    this.spinner.show();
    this.services.getData<any[]>(this.services.BASE_URL_AEROPUERTO, 'aviones/obtener/todos').toPromise().then(async res => {
      this.estados = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/1').toPromise();
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
    this.aerolinea = null;
    this.actualizarForm.get('numeroAvion').enable();
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*
   * Metodo para guardar una aerolinea
   */
  public guardarAerolinea() {
    this.spinner.show();
    try {
      if (!this.actualizar) {
        const crearAerolinea: any = {
          idAvion: this.actualizarForm.get('numeroAvion').value,
          modeloAvion: this.actualizarForm.get('modelo').value,
          anioAvion: this.actualizarForm.get('anio').value,
          idAerolinea: this.actualizarForm.get('aerolinea').value,
          estadoAvion: this.actualizarForm.get('estadoAvion').value

        }
        console.log(crearAerolinea);
        this.services.postData(this.services.BASE_URL_AEROPUERTO, 'aviones/crear', crearAerolinea).toPromise().then(res => {
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
        console.log(this.aerolinea.id_Avion);
        this.services.putData(this.services.BASE_URL_AEROPUERTO, `aviones/actulizar/${(this.aerolinea.id_Avion)}`, actulizarAvion).toPromise().then(res => {
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
  *Metodo para actulizar una aerolinea
   */
  async actualizarAerolinea(aerolinea: any) {
    this.aerolinea = aerolinea;
    this.actualizar = true;
    console.log(aerolinea);
    this.actualizarForm.get('numeroAvion').setValue(aerolinea?.id_Avion);
    this.actualizarForm.get('modelo').setValue(aerolinea?.modelo);
    this.actualizarForm.get('anio').setValue(aerolinea?.anio);
    this.actualizarForm.get('aerolinea').setValue(aerolinea?.aerolinea);
    this.actualizarForm.get('estadoAvion').setValue(aerolinea?.estado_Avion);
    this.actualizarForm.get('numeroAvion').disable();
  }

  eliminarAerolinea(eliminar: any) {
    this.actualizarAerolinea(eliminar);
    Swal.fire({
      titleText: "Confirmar Eliminación",
      text: `¿Está seguro que desea eliminar esta aerolinea?`,
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
          const eliminarAerolinea: any = {
            nombreAerolinea: this.actualizarForm.get('nombreAerolinea').value,
            telefonoAerolinea: this.actualizarForm.get('telefonoAerolinea').value,
            correoAerolinea: this.actualizarForm.get('correoAerolinea').value,
            direccionAerolinea: this.actualizarForm.get('direccionAerolinea').value,
            estadoAerolinea: 43
          }
          console.log(eliminarAerolinea);
          console.log(this.aerolinea.id_Aerolinea);
          this.services.putData(this.services.BASE_URL_AEROPUERTO, `aerolineas/actualizar/${(this.aerolinea.id_Aerolinea)}`, eliminarAerolinea).toPromise().then(res => {
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
            this.services.forcedNavigate(['/administracion-aerolineas']);
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
