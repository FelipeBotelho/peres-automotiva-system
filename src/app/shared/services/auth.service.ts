import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserRoleService } from './user-role.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private userRoleService: UserRoleService,
    private toastr: ToastrService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        const role = this.userRoleService.GetUserRole(user.uid);
        role.valueChanges().subscribe({
          next: (data) => {
            if (this.isLoggedIn) {
              const role = data.roles;
              localStorage.setItem('user-role', role);
              JSON.parse(localStorage.getItem('user')!);
            }
          },
        });
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('user-role');
        JSON.parse(localStorage.getItem('user')!);
        return;
      }
    });
  }
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            const role = this.userRoleService.GetUserRole(user.uid);
            role.valueChanges().subscribe({
              next: (data) => {
                if (this.isLoggedIn) {
                  const role = data.roles;
                  localStorage.setItem('user-role', role);
                  this.router.navigate(['/estoque/consultar-estoque']);
                }
              },
            });
          }
        });
      })
      .catch((error) => {
        this.toastr.error(error.message);
      });
  }


  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['authentication/verify-email-address']);
      });
  }

  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.toastr.success('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        this.toastr.error(error);
      });
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['home']);
    });
  }

  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['home']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        this.toastr.error(error);
      });
  }

  SignUp(name: string, email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          result.user
            .updateProfile({
              displayName: name,
            })
            .then((data) => {
              this.SendVerificationMail();
              this.SetUserRoles(result.user);
              this.SetUserData(result.user);
            });
        }
      })
      .catch((error) => {
        this.toastr.error(error.message);
      });
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SetUserRoles(user: any) {
    return this.userRoleService.AddRole(user.uid, 'Vendedor');
  }

  GetUserRoles(userId: string) {
    return this.userRoleService.GetUserRole(userId);
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('user-role');
      this.router.navigate(['authentication/sign-in']);
    });
  }
}
