import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestoreDocument } from '@angular/fire/firestore/document/document';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

import { SessionStore } from './session.store';
import { User } from '../../shared/interfaces/user';
import { SnackBar } from '../../shared/snack-bar';

import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SessionService {

  private currentUserData: User;

  constructor(
    private sessionStore: SessionStore,     //Akita Session Store, дані при стан сесії
    private afStore: AngularFirestore,      //Сервіс для взаємодії з Firebase Firestore
    private afAuth: AngularFireAuth,        //Сервіс для взаємодії з Firebase Auth
    private router : Router,                //Сервіс для надання послуг Роутінгу
    private bar: SnackBar,
  ) { 
    this.getUserInSession().subscribe(user => {
      this.currentUserData = user;
    });
  }

    //Встановлення користувача в сесії
  public login(creds: User) {
    this.sessionStore.login(creds);
  }

    //Видалення користувача з сесії
  public logout() {
    this.sessionStore.logout();
  }

    //Роль поточного користувача
  public isAdmin(): Observable<boolean> {
    return this.getUserData().pipe(
      take(1),
      map(user => user && user.roles.admin ? true : false),
    );
  }

    //Дані користувача з Firebase Firestore
  public getUserData(): Observable<User> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.afStore.doc<User>(`users/${user.uid}`).valueChanges();
        }
        else {
          return of({} as User);
        }
      })
    )
  }
  
    //Дані користувача з Firebase Auth
  public getUserInSession(): Observable<any> {
    return this.afAuth.user;
  }

    //Зміна даних користувача в Firebase Firestore
  public updateUserData(userData: User) {
    this.afStore.doc<User>(`users/${this.currentUserData.uid}`).update(userData);
  }

    //Встановлення нового паролю
  public updateUserPassword(newPassword: string) {
    auth().currentUser.updatePassword(newPassword)
    .then(() => {
      this.router.navigate(['/profile', {uid: this.currentUserData.uid}]);
    }).catch(error => {
      console.error('Password update error::' + error);
      this.bar.openSnackBar('Photo update error::' + error, 'OK');
    });
  }

    //Встановлення нового фото профілю
  public updateUserPhotoUrl(newUrl: string) {
    this.getUserData().subscribe(user => {
      user.photoURL = newUrl;
      this.updateUserData(user);
    });
    auth().currentUser.updateProfile({
      photoURL: newUrl
    }).catch(error =>{
      console.error('Photo update error::' + error);
      this.bar.openSnackBar('Photo update error::' + error, 'OK');
    });
  }

    //Встановлення нового нікнейму
  public updateUserDisplayName(newDisplayName: string) {
    this.getUserData().subscribe(user => {
      user.displayName = newDisplayName;
      this.updateUserData(user);
    });
    auth().currentUser.updateProfile({
      displayName: newDisplayName
    }).catch(error =>{
      console.error('Username update error::' + error);
      this.bar.openSnackBar('Username update error::' + error, 'OK');
    });
  }

    //Видалення даних про користувача
  public removeUserData() {
    const uid = this.currentUserData.uid;
    this.logout();
    this.afStore.doc<User>(`users/${uid}`).delete();
    auth().currentUser.delete();
  }

    //Завантаження даних користувача при логіні
  public setUserData(user): Promise<any> {
    const userData = this.generateData(user);
    return userData.ref.set(userData.data, {merge: true});
  }

    //Завантаження даних користувача при реєстрації
  public firstSetUserData(user): Promise<any> {
    const userData = this.generateData(user);
    userData.data.bookmarks = [];
    userData.data.roles= {reader: true};
    return userData.ref.set(userData.data, {merge: true});
  }

    //Генерація екземпляра User
  private generateData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc<any>(`users/${user.uid}`);
    const userData: User =  {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: (user.photoURL)? user.photoURL : "",
      emailVerified: user.emailVerified,
      
    };
    return {ref: userRef, data: userData};
  }
}