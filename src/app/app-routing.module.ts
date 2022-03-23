import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearBoletoComponent } from './componentes-solicitante/crear-boleto/crear-boleto.component';

const routes: Routes = [
  { path: 'crear-boleto', 
  component: CrearBoletoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }