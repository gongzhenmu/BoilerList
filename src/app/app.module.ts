import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule} from '@angular/material';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateAccountComponent } from './create-account/create-account.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'post-create',      component: PostCreateComponent },
  { path: 'post-create',      component: PostListComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    ToolbarComponent,
    PostListComponent,
    CreateAccountComponent,
    PageNotFoundComponent
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
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }