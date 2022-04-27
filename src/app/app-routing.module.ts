import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionAerolineasComponent } from './componentes-administracion/administracion-aerolineas/administracion-aerolineas.component';
import { AdministracionAvionesComponent } from './componentes-administracion/administracion-aviones/administracion-aviones.component';
import { CrearBoletoComponent } from './componentes-solicitante/crear-boleto/crear-boleto.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }