import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActulizarAerolinea, Aerolinea } from 'src/app/componentes-comunes/classes/Aerolinea.class';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion-aerolineas',
  templateUrl: './administracion-aerolineas.component.html',
  styleUrls: ['./administracion-aerolineas.component.scss']
})
export class AdministracionAerolineasComponent implements OnInit {

  actualizarForm: FormGroup;
  aerolinea: any;
  actualizar: boolean = false;
  estados: any;

  headerColumnNames: string[] = ['idAerolinea', 'nombre', 'telefono', 'correo', 'acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('close') close: any;


  constructor(
    private spinner: NgxSpinnerService,
    private services: Servicios,
    private _formBuilder: FormBuilder
  ) {
    this.actualizarForm = this._formBuilder.group({
      idAerolinea: [null],
      nombreAerolinea: [null, Validators.required],
      telefonoAerolinea: [null, Validators.required],
      correoAerolinea: [null, Validators.required],
      direccionAerolinea: [null, Validators.required],
      estadoAerolinea: [19, Validators.required]
    });
  }

  async ngOnInit() {
    /*     this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 4000); */
    this.obtenerAerolinea();

  }

  async obtenerAerolinea() {
    this.spinner.show();
    this.services.getData<Aerolinea[]>(this.services.BASE_URL_AEROPUERTO, 'aerolinea/obtener/todas').toPromise().then(async res => {
      this.estados = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/aerolinea').toPromise();
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
    this.actualizarForm.get('nombreAerolinea').enable();
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
          idAerolinea: null,
          nombreAerolinea: this.actualizarForm.get('nombreAerolinea').value,
          telefonoAerolinea: Number(this.actualizarForm.get('telefonoAerolinea').value),
          correoAerolinea: this.actualizarForm.get('correoAerolinea').value,
          direccionAerolinea: this.actualizarForm.get('direccionAerolinea').value,
          estadoAerolinea: this.actualizarForm.get('estadoAerolinea').value

        }
        console.log(crearAerolinea);
        this.services.postData(this.services.BASE_URL_AEROPUERTO, 'aerolineas/crear', crearAerolinea).toPromise().then(res => {
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
          this.services.forcedNavigate(['/administracion-aerolineas']);
        })

      } else {
        const actulizarAerolinea: any = {
          nombreAerolinea: this.actualizarForm.get('nombreAerolinea').value,
          telefonoAerolinea: this.actualizarForm.get('telefonoAerolinea').value,
          correoAerolinea: this.actualizarForm.get('correoAerolinea').value,
          direccionAerolinea: this.actualizarForm.get('direccionAerolinea').value,
          estadoAerolinea: this.actualizarForm.get('estadoAerolinea').value
        }
        console.log(actulizarAerolinea);
        console.log(this.aerolinea.id_Aerolinea);
        this.services.putData(this.services.BASE_URL_AEROPUERTO, `aerolineas/actualizar/${(this.aerolinea.id_Aerolinea)}`, actulizarAerolinea).toPromise().then(res => {
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
    this.actualizarForm.get('nombreAerolinea').setValue(aerolinea?.nombre_Aerolinea);
    this.actualizarForm.get('telefonoAerolinea').setValue(aerolinea?.telefono_Aerolinea);
    this.actualizarForm.get('correoAerolinea').setValue(aerolinea?.correo_Aerolinea);
    this.actualizarForm.get('direccionAerolinea').setValue(aerolinea?.direccion_Aerolinea);
    this.actualizarForm.get('estadoAerolinea').setValue(aerolinea?.estado_Aerolinea);
    this.actualizarForm.get('nombreAerolinea').disable();
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
