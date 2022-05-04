import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './componentes-comunes/utils/material-module';
import { CrearBoletoComponent } from './componentes-solicitante/crear-boleto/crear-boleto.component';
import { AdministracionAerolineasComponent } from './componentes-administracion/administracion-aerolineas/administracion-aerolineas.component';
import { AdministracionAvionesComponent } from './componentes-administracion/administracion-aviones/administracion-aviones.component';
import { AdministracionEmpleadosComponent } from './componentes-administracion/administracion-empleados/administracion-empleados.component';
import { AdministracionVuelosComponent } from './componentes-administracion/administracion-vuelos/administracion-vuelos.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearBoletoComponent,
    AdministracionAerolineasComponent,
    AdministracionAvionesComponent,
    AdministracionEmpleadosComponent,
    AdministracionVuelosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
