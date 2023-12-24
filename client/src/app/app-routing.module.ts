import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ApplicationPageComponent } from './application-page/application-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AuthRoleGuard } from './shared/classes/authRole.guard';
import { ClientPageComponent } from './client-page/client-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'application',
        component: ApplicationPageComponent,
      },
    ],
  },

  {
    path: 'admin-dashboard',
    component: AdminPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [1] }, // Только для админа
  },

  {
    path: 'client-dashboard',
    component: ClientPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [2] }, // Только для клиента
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
