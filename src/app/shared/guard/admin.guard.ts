import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: UserAuthService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.admin ? true : false),
      tap(isAdmin => {
        if(!isAdmin) {
          console.error('Access denied - Admin only!');
        }
      })
    );
  } 
}
