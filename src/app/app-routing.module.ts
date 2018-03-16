import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/index';
import { AuthGuard } from './_services/index';
import { StateComponent } from './state/index';
import { StateDetailComponent } from './state/index';
import { TicketComponent } from './ticket/index';
import { TicketDetailComponent } from './ticket/index';


const routes: Routes = [
  { path: 'state', component: StateComponent, canActivate: [AuthGuard] },
  { path: 'state/detail/:id' , component: StateDetailComponent, canActivate: [AuthGuard] },
  { path: 'ticket', component: TicketComponent, canActivate: [AuthGuard] },
  { path: 'ticket/detail/:id' , component: TicketDetailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/ticket', pathMatch: 'full' },
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
