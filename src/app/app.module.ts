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
import { PlantillaBoletoComponent } from './componentes-solicitante/plantilla-boleto/plantilla-boleto.component';
import { AdministracionVuelosComponent } from './componentes-administracion/administracion-vuelos/administracion-vuelos.component';
import { AdministracionEmpleadosComponent } from './componentes-administracion/administracion-empleados/administracion-empleados.component';
import { RevisarBoletoComponent } from './componentes-administracion/revisar-boleto/revisar-boleto.component';
import { ConsultaBoletoComponent } from './componentes-solicitante/consulta-boleto/consulta-boleto.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearBoletoComponent,
    AdministracionAerolineasComponent,
    AdministracionVuelosComponent,
    AdministracionEmpleadosComponent,
    AdministracionAvionesComponent,
    PlantillaBoletoComponent,
    RevisarBoletoComponent,
    ConsultaBoletoComponent,
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
