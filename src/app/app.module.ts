import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatSelectModule,
  MatChipsModule, MatIconModule, MatRadioModule, MatSlideToggleModule, MatButtonToggleModule
} from '@angular/material';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CreateAccountComponent } from './create-account/create-account.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { MatSliderModule } from '@angular/material/slider';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SearchComponent } from './search/search.component';
import { FeedbackComponent } from './feedback/feedback.component';
import {Ng5SliderModule} from 'ng5-slider';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';


const appRoutes: Routes = [
  { path: 'create-account', component: CreateAccountComponent  },
  { path: 'post-create',      component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'profile/post-edit/:postId',      component: PostCreateComponent , canActivate: [AuthGuard]},
  { path: 'profileEdit/post-edit/:postId',      component: PostCreateComponent , canActivate: [AuthGuard]},
  { path: '',  component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'login',      component: LoginComponent },
  { path: 'profile',      component: ProfileComponent , canActivate: [AuthGuard]},
  { path: 'search',      component: SearchComponent , canActivate: [AuthGuard]},
  { path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'profileEdit',      component: ProfileEditComponent , canActivate: [AuthGuard]},
  { path: 'feedback', component:FeedbackComponent, canActivate:[AuthGuard]},
  { path: 'forget-password', component:ForgetPasswordComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    ToolbarComponent,
    PostListComponent,
    CreateAccountComponent,
    PageNotFoundComponent,
    LoginComponent,
    ProfileComponent,
    ProfileEditComponent,
    SearchComponent,
    FeedbackComponent,
    ForgetPasswordComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        HttpClientModule,
        MatSliderModule,
        NgbModule,
        RouterModule.forRoot(
            appRoutes,
            {enableTracing: true} // <-- debugging purposes only
        ),
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatRadioModule,
        MatSlideToggleModule,
        Ng5SliderModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
    ],
  providers: [
    AuthGuard, NgxImageCompressService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
