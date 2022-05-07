import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionAerolineasComponent } from './componentes-administracion/administracion-aerolineas/administracion-aerolineas.component';
import { AdministracionAvionesComponent } from './componentes-administracion/administracion-aviones/administracion-aviones.component';
import { AdministracionEmpleadosComponent } from './componentes-administracion/administracion-empleados/administracion-empleados.component';
import { AdministracionVuelosComponent } from './componentes-administracion/administracion-vuelos/administracion-vuelos.component';
import { CrearBoletoComponent } from './componentes-solicitante/crear-boleto/crear-boleto.component';
import { PlantillaBoletoComponent } from './componentes-solicitante/plantilla-boleto/plantilla-boleto.component';

const routes: Routes = [
  {
    path: 'crear-boleto',
    component: CrearBoletoComponent
  },
  {
    path: 'administracion-aerolineas',
    component: AdministracionAerolineasComponent
  },
  {
    path: 'administracion-aviones',
    component: AdministracionAvionesComponent
  },
  {
    path: 'plantilla',
    component: PlantillaBoletoComponent
  },
  {
    path: 'administracion-empleados',
    component: AdministracionEmpleadosComponent
  },
  {
    path: 'administracion-vuelos',
    component: AdministracionVuelosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }