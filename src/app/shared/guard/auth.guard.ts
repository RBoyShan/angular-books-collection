import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SessionQuery } from "../../session/state/session.query";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public sessionQuery: SessionQuery,
    public router: Router
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    setTimeout(() => {
      if(!this.sessionQuery.isLoggedIn()) {
        this.router.navigate([''])
      }
    },2000);
    return true;
  }

}