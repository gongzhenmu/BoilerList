import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {RegisterComponent} from './register/register.component';
import {MainComponent} from './common/main/main.component';


const routes: Routes = [

  {
    path: 'register', component: RegisterComponent
  },
  {
    path: '', component: MainComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
