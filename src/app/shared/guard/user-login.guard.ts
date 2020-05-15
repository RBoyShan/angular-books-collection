import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionQuery } from '../../session/state/session.query';

@Injectable({
  providedIn: 'root'
})
export class UserLoginGuard implements CanActivate {

  constructor(
    private sessionQuery: SessionQuery,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      setTimeout(()=>{
        if(this.sessionQuery.isLoggedIn()) {
          this.router.navigate([''])
        }
      }, 2000)
    return true;
  }
  
}
