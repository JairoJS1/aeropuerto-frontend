import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Servicios } from 'src/app/componentes-comunes/services/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion-empleados',
  templateUrl: './administracion-empleados.component.html',
  styleUrls: ['./administracion-empleados.component.scss']
})
export class AdministracionEmpleadosComponent implements OnInit {

  actualizarForm: FormGroup;
  empleado: any;
  departamentos: any;
  actualizar: boolean = false;
  estados: any;
  //identificadores, no afecta
  key: any;
  teclado: any;
  numero: any;
  especiales: any;
  teclado_especial: boolean;
  roles: any;
  loaded: boolean = false;
  msg = '';

  headerColumnNames: string[] = ['nombre', 'departamento', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('close') close: any;
  constructor(
    private spinner: NgxSpinnerService,
    private services: Servicios,
    private _formBuilder: FormBuilder
  ) {
    this.actualizarForm = this._formBuilder.group({
      //para ingresar datos 
      dpi: [null, Validators.required],
      nombre: [null, Validators.required],
      apellido: [null, Validators.required],
      fechaNac: [null, Validators.nullValidator],
      telefono: [null, Validators.nullValidator],
      correo: [null, Validators.email],
      estado: [null, Validators.required],
      departamento: [null, Validators.required],
      numeroVuelo: [null, Validators.nullValidator]
    });
  }

  async ngOnInit() {
    this.roles = (JSON.parse(localStorage.getItem('formDataFilter')));
    if(this.roles == null){
      this.loaded = true;
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
    }else if (this.roles.BASE_ROL == '' || this.roles.BASE_ROL != 'Admin') {
      this.msg = 'Usted no cuenta con los permisos necesarios para acceder al Sistema.';
      this.loaded = true;
    }else{
      this.loaded = false;
      this.obtenerEmpleados();
    }
    
  }

  async obtenerEmpleados() {
    this.spinner.show();
    //catalogo para moestrar datos
    this.services.getData<any[]>(this.services.BASE_URL_AEROPUERTO, 'empleados/obtener/todos').toPromise().then(async res => {
      this.estados = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/2').toPromise();
      this.departamentos = await this.services.getData(this.services.BASE_URL_AEROPUERTO, 'catalogos/codigo/padre/5').toPromise();
      console.log(this.estados, this.departamentos)
      console.log(res);
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
    this.actualizarForm.get('dpi').enable();
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /*
   * Metodo para guardar una aerolinea
   */
  public guardarEmpleado() {
    this.spinner.show();
    try {
      if (!this.actualizar) {
        // cualquiernombre
        const crearEmpleado: any = {
          //nombre del swagger
          //datos para guardar
          dpiEmpleado: this.actualizarForm.get('dpi').value,
          nombreEmpleado: this.actualizarForm.get('nombre').value,
          apellidoEmpleado: this.actualizarForm.get('apellido').value,
          telefonoEmpleado: this.actualizarForm.get('telefono').value,
          fechaNacimiento: this.actualizarForm.get('fechaNac').value,
          correoEmpleado: this.actualizarForm.get('correo').value,
          departamentoEmpleado: this.actualizarForm.get('departamento').value,
          estadoEmpleado: this.actualizarForm.get('estado').value,
          numeroVuelo: this.actualizarForm.get('numeroVuelo').value
        }
        console.log(crearEmpleado);
        this.services.postData(this.services.BASE_URL_AEROPUERTO, 'empleados/crear', crearEmpleado).toPromise().then(res => {
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
          this.services.forcedNavigate(['/administracion-empleados']);
        })

      } else {
        const actulizarEmpleado: any = {
          nombreEmpleado: this.actualizarForm.get('nombre').value,
          apellidoEmpleado: this.actualizarForm.get('apellido').value,
          telefonoEmpleado: this.actualizarForm.get('telefono').value,
          fechaNacimiento: this.actualizarForm.get('fechaNac').value,
          correoEmpleado: this.actualizarForm.get('correo').value,
          departamentoEmpleado: this.actualizarForm.get('departamento').value,
          estadoEmpleado: this.actualizarForm.get('estado').value,
          numeroVuelo: this.actualizarForm.get('numeroVuelo').value
        }
        console.log(actulizarEmpleado);
        //       console.log(this.departamento.);
        this.services.putData(this.services.BASE_URL_AEROPUERTO, `empleados/actualizar/${(this.empleado.dpi)}`, actulizarEmpleado).toPromise().then(res => {
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
          this.services.forcedNavigate(['/administracion-empleados']);
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
  async actualizarEmpleado(empleado: any) {
    this.empleado = empleado;
    this.actualizar = true;
    console.log(this.empleado);
    //variables linea 34 
    //variables swagger
    this.actualizarForm.get('dpi').setValue(empleado?.dpi);
    this.actualizarForm.get('nombre').setValue(empleado?.nombre_empleado);
    this.actualizarForm.get('apellido').setValue(empleado?.apellido_empleado);
    this.actualizarForm.get('fechaNac').setValue(empleado?.fecha_nacimiento);
    this.actualizarForm.get('telefono').setValue(empleado?.telefono_empleado);
    this.actualizarForm.get('correo').setValue(empleado?.correo_empleado);
    this.actualizarForm.get('estado').setValue(empleado?.estado_empleado);
    this.actualizarForm.get('departamento').setValue(empleado?.departamento);
    this.actualizarForm.get('numeroVuelo').setValue(empleado?.numero_vuelo);
  }

  eliminarEmpleado(eliminar: any) {
    this.actualizarEmpleado(eliminar);
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
          const eliminarEmpleado: any = {
            //linea34
            nombreEmpleado: this.actualizarForm.get('nombre').value,
            apellidoEmpleado: this.actualizarForm.get('apellido').value,
            telefonoEmpleado: this.actualizarForm.get('telefono').value,
            fechaNacimiento: moment(this.actualizarForm.get('fechaNac').value).format('YYYY-MM-DD'),
            correoEmpleado: this.actualizarForm.get('correo').value,
            departamentoEmpleado: this.actualizarForm.get('departamento').value,
            estadoEmpleado: 7,
            numeroVuelo: this.actualizarForm.get('numeroVuelo').value,
          }
          console.log(eliminarEmpleado);
          console.log(this.empleado.dpi);
          this.services.putData(this.services.BASE_URL_AEROPUERTO, `empleados/actualizar/${(this.empleado.dpi)}`, eliminarEmpleado).toPromise().then(res => {
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
            this.services.forcedNavigate(['/administracion-empleados']);
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



  public telefonoValidar(e) {
    this.key = e.keyCode || e.which;
    this.teclado = String.fromCharCode(this.key);
    this.especiales = '8';
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


  public dpiValidar(e) {
    this.key = e.keyCode || e.which;
    this.teclado = String.fromCharCode(this.key);
    this.especiales = '13';
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