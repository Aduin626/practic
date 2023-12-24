import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ApplicationPageComponent } from './application-page/application-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfimComponent } from './shared/modal/confim/confim.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    LoginPageComponent,
    ApplicationPageComponent,
    AdminPageComponent,
    ConfimComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
