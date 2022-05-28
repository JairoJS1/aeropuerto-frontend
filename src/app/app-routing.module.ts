import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionAerolineasComponent } from './componentes-administracion/administracion-aerolineas/administracion-aerolineas.component';
import { AdministracionAvionesComponent } from './componentes-administracion/administracion-aviones/administracion-aviones.component';
import { AdministracionEmpleadosComponent } from './componentes-administracion/administracion-empleados/administracion-empleados.component';
import { AdministracionVuelosComponent } from './componentes-administracion/administracion-vuelos/administracion-vuelos.component';
import { RevisarBoletoComponent } from './componentes-administracion/revisar-boleto/revisar-boleto.component';
import { ConsultaBoletoComponent } from './componentes-solicitante/consulta-boleto/consulta-boleto.component';
import { CrearBoletoComponent } from './componentes-solicitante/crear-boleto/crear-boleto.component';
import { PlantillaBoletoComponent } from './componentes-solicitante/plantilla-boleto/plantilla-boleto.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
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
  },
  {
    path: 'revisar-boleto',
    component: RevisarBoletoComponent
  },
  {
    path: 'consulta-boleto',
    component: ConsultaBoletoComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }