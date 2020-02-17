import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { MainComponent } from './common/main/main.component';
import {RegisterComponent} from './register/register.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth.service';
//import {OtherService} from './other.service';
import {ReactiveFormsModule } from '@angular/forms';
//import { ProfileComponent } from './profile/profile.component';
//import { TimelineComponent } from './timeline/timeline.component';
import {CookieService} from 'angular2-cookie/core';
import {AuthInterceptor} from './auth-interceptor';
//import { TestComponent } from './test/test.component';
//import {FinduserComponent} from './finduser/finduser.component';
// { OtherProfileComponent } from './other-profile/other-profile.component';
import {DatePipe} from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    RegisterComponent,
    //ProfileComponent,
    //TestComponent,
    //OtherProfileComponent,
    // DataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, CookieService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}

