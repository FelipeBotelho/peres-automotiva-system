import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationAppComponent } from './authentication.app.component';
import { AuthenticationGuard } from './authentication.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const authenticationRouterConfig: Routes = [
  {
    path: '',
    component: AuthenticationAppComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'register-user',
        component: SignUpComponent,
        canActivate: [AuthenticationGuard],
      },

      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'verify-email-address',
        component: VerifyEmailComponent,
        canActivate: [AuthenticationGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRouterConfig)],
  exports: [RouterModule],
})
export class AuthenticationRouterModule {}
