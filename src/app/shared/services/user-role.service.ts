import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  constructor(public afs: AngularFirestore) {}
  GetUserRole(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `user-roles/${userId}`
    );
    return userRef;
  }

  AddRole(userId: any, roleName: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `user-roles/${userId}`
    );
    const userData = {
      roles: roleName,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}
