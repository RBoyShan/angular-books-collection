import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { auth } from 'firebase';
import * as firebase from 'firebase/app';

import { User } from 'src/app/shared/interfaces/user';
import { SessionService } from 'src/app/session/state/session.service';
import { SnackBar } from '../snack-bar';

import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    public user: any;
    public user$: Observable<any>; //Данні авторизованого користувача 

    constructor(
        private afStore: AngularFirestore,          //Сервіс для роботи з Firebase Firectore
        private afAuth: AngularFireAuth,            //Сервіс для роботи з Firebase Auth
        private router: Router,                     //Сервіс для надання послуг Роутінгу
        private ngZone: NgZone,                     
        private sessionService: SessionService,
        private bar: SnackBar    
    ) { 
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if(user) {
                    this.setUserInSession(user);
                    return this.afStore.doc<User>(`users/${user.uid}`).valueChanges();
                }
                else {
                    return of();
                }
            })
        );
        this.user$.subscribe();
    }

    // Авторизація логін/пароль
    public signIn(email: string, password: string): Promise<any> {
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then(rezult => {
                this.ngZone.run(() =>{
                    this.router.navigate(['']);
                })
                this.sessionService.setUserData(rezult.user);
                this.setUserInSession(rezult.user);
                window.location.reload();
            })
            .catch(error => {
                this.bar.openSnackBar(error.message, 'OK');
            });
    }

    // Регістрація логін/пароль
    public signUp(email: string, password: string, username?: string): Promise<any> {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(rezult => {
                this.sendVerificationMail();
                rezult.user.updateProfile({displayName: username});
                this.sessionService.firstSetUserData(rezult.user);
                this.setUserInSession(rezult.user);
            })
            .catch(error => {
                this.bar.openSnackBar(error.message, 'OK');
            });
    }

    // Відправка листа верифікації при реєстрація нового користувача
    public sendVerificationMail(): Promise<any> {
        return firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
                this.router.navigate(['verify-email-addres/']);
            });
    }

    // Скидання паролю
    public forgotPassword(email: string): Promise<any> {
        return firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                this.bar.openSnackBar('Password reset email sent, check your inbox.', 'OK');
            }).catch((error) => {
                this.bar.openSnackBar(error, 'OK');
            });
    }

    // Авторизація через Google
    public signInGoogle(): Promise<any> {
        console.log('Redirect to Google logged in form!');
        return this.authLogin(new firebase.auth.GoogleAuthProvider());
    }

    // Вихід з облікового запису
    public signOut(): Promise<any> {
        return firebase.auth().signOut()
            .then(() => {
                this.sessionService.logout();
                this.router.navigate(['sign-in']);
            });
    }

    //Встановлення користувача в сесії
    private setUserInSession(user: User) {
        this.sessionService.login(user);
    }

    // Запуск асторизації за допомогою провайдера (Google, Twitter, Facebook)
    private authLogin(provider: auth.AuthProvider): Promise<any> {
        return firebase.auth().signInWithPopup(provider)
            .then(rezult => {
                this.ngZone.run(() =>{
                    this.router.navigate(['']);
                })
                this.sessionService.firstSetUserData(rezult.user);
                this.setUserInSession(rezult.user);
            })
            .catch(error => {
                this.bar.openSnackBar(error, 'OK');
            });
    }

}