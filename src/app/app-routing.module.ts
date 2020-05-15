import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { DetailBookComponent } from './books/detail-book/detail-book.component';
import { EditBookDataComponent } from './books/edit-book-data/edit-book-data.component';
import { UserProfileComponent } from './session/user-profile/user-profile.component';
import { SignUpComponent } from './session/sign-up/sign-up.component';
import { SignInComponent } from './session/sign-in/sign-in.component';
import { VerifyEmailComponent } from './session/verify-email/verify-email.component';
import { CreateBookDataComponent } from './books/create-book-data/create-book-data.component';
import { BooksListComponent } from './books/books-list/books-list.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { UserLoginGuard } from './shared/guard/user-login.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminGuard } from './shared/guard/admin.guard';


const routes: Routes = [
  {path: "", loadChildren: () => import("./main/main.module").then(m => m.MainModule)},
  {path: 'books-list', component: BooksListComponent},
  {path: 'books-list/:category', component: BooksListComponent},
  {path: 'detail-book/:id', component: DetailBookComponent },
  {path: 'detail-book/:id/content/:view', component: DetailBookComponent},
  {path: 'detail-book/:id/content/:view/:page', component: DetailBookComponent},
  {path: 'create-book', component: CreateBookDataComponent, canActivate: [AdminGuard]},
  {path: 'edit-book/:id', component: EditBookDataComponent, canActivate: [AdminGuard]},
  {path: 'sign-up', component: SignUpComponent, canActivate : [UserLoginGuard]},
  {path: 'sign-in', component: SignInComponent, canActivate : [UserLoginGuard]},
  {path: 'verify-email-addres', component: VerifyEmailComponent, canActivate : [UserLoginGuard]},
  {path: 'profile/:uid', component: UserProfileComponent, canActivate: [AuthGuard] },
  {path: "**", component: PageNotFoundComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollOffset: [0,0] ,scrollPositionRestoration: "top"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }