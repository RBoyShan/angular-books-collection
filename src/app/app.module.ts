import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import * as angularFire2 from 'angularfire2';

import { AngularFireStorageModule } from 'angularfire2/storage';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { SearchBooksComponent } from './books/search-books/search-books.component'
import { UserProfileComponent } from './session/user-profile/user-profile.component';
import { SignInComponent } from './session/sign-in/sign-in.component';
import { SignUpComponent } from './session/sign-up/sign-up.component';
import { VerifyEmailComponent } from './session/verify-email/verify-email.component';
import { CreateBookDataComponent } from './books/create-book-data/create-book-data.component';
import { DetailBookComponent, DialogOverview } from './books/detail-book/detail-book.component';
import { EditBookDataComponent } from './books/edit-book-data/edit-book-data.component';
import { BooksListComponent } from './books/books-list/books-list.component';
import { ShowIfLoggedInDirective } from './shared/directives/show-if-logged-in.directive';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminDirective } from './shared/directives/admin.directive';

@NgModule({
  declarations: [
    AppComponent,
    CreateBookDataComponent,
    SearchBooksComponent,
    DetailBookComponent,
    DialogOverview,
    EditBookDataComponent,
    BooksListComponent,
    UserProfileComponent,
    SignInComponent,
    SignUpComponent,
    VerifyEmailComponent,
    ShowIfLoggedInDirective,
    MainNavComponent,
    PageNotFoundComponent,
    AdminDirective,
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    angularFire2.AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    PdfViewerModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatTooltipModule,
    MaterialFileInputModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }