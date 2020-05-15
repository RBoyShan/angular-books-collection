import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { category } from '../category';

import { UserAuthService } from 'src/app/shared/services/user-auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { BooksService } from '../books/state/books.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {

  public isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  public categories: string[] = category;
  public curUser: any;

  constructor(
    private auth: UserAuthService,
    private afAuth: AngularFireAuth,
    private booksService: BooksService,
    private breakpointObserver: BreakpointObserver
  ) { }

  public logout() {
    this.auth.signOut();
    setTimeout(() => {
      window.location.reload();
    },500)
  }

  ngOnInit(): void {
    this.booksService.connect().pipe(untilDestroyed(this)).subscribe();
    this.afAuth.authState.pipe(untilDestroyed(this)).subscribe(user => {
      this.curUser = user;
    })
  }
 
  ngOnDestroy(): void {
 
  }

}
