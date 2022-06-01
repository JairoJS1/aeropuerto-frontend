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
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import Amplify from 'aws-amplify';
import { ErrorComponent } from './componentes-comunes/services/error/error/error.component';
import { MenuComponent } from './componentes-administracion/menu/menu.component';


Amplify.configure({
  Auth:{
    mandatorySignIn:true,
    region: 'us-east-1',
    userPoolId: 'us-east-1_1YxqGFRfe',
    userPoolWebClientId: '2s3fqpvsraqhuc047f52k5el3l',
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
})

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
    LoginComponent,
    SignUpComponent,
    ErrorComponent,
    MenuComponent,
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
