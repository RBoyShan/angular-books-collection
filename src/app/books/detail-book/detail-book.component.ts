import { Component, OnInit, OnDestroy, Inject, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Book } from '../state/book.model';
import { BooksService } from '../state/books.service';
import { SessionService } from 'src/app/session/state/session.service';
import { User } from 'src/app/shared/interfaces/user';
import { BookMark } from 'src/app/shared/interfaces/bookmarks';
import { SnackBar } from 'src/app/shared/snack-bar';
import { BookView } from 'src/app/shared/interfaces/book-view';

import { FirebaseCloudStorageService } from '../../shared/services/firebase-cloud-ctorage.service';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PDFProgressData, PDFDocumentProxy } from 'ng2-pdf-viewer';


@Component({
  selector: 'app-detail-book',
  templateUrl: './detail-book.component.html',
  styleUrls: ['./detail-book.component.css']
})
export class DetailBookComponent implements OnInit, OnDestroy {

  public currentBook: Book;
  public bookView: BookView;
  public imgSrc: string;
  public bookmarkDescription: string;
  public content: any = this.route.snapshot.paramMap.get('view');
  public progressData: PDFProgressData;
  public isLoaded: boolean = false;

  private pdf: any;
  private pdfSrc: string;
  private book$: Observable<Book>;
  private currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private fireStorage: FirebaseCloudStorageService,
    private location: Location,
    private session: SessionService,
    private dialog: MatDialog,
    private bar: SnackBar
  ) { }  

  public afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;
  }

  public onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;
    this.isLoaded = false;
  }

  public getInt(val: number): number {
    return Math.round(val);
  }

  public zoom(val: number) {
    this.bookView.zoom += val;
  }

  public prev() {
    if (this.bookView.page != 1) {
      this.bookView.page--;
    }
  }

  public next() {
    if (this.bookView.page < this.currentBook.countPages) {
      this.bookView.page++;
    }
  }

  public pageChange(page: number) {
    if(page > 0 && page <= this.currentBook.countPages) {
      this.bookView.page = page;
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '350px',
      data: this.bookmarkDescription
    });
    dialogRef.afterClosed().subscribe(result => {
      this.bookmarkDescription = result;
      this.addBookMark();
    });
  }

  public addBookMark(): void {
    let bookMark: BookMark = {
      bookId: this.currentBook.id as string,
      bookName: this.currentBook.name,
      page: this.bookView.page,
      description: (this.bookmarkDescription) ? this.bookmarkDescription : 'No Description'
    };
    this.bookmarkDescription = '';
    this.currentUser.bookmarks.push(bookMark);
    this.session.updateUserData(this.currentUser);
    this.bar.openSnackBar('Bookmark added!', 'OK');
  }

  private setCurrentUserInSession() {
    this.session.getUserData().pipe(untilDestroyed(this)).subscribe(user => {
      this.currentUser = user; 
    });
  }

  private setImageUrl(way: string): void {
    this.fireStorage.download(way).pipe(untilDestroyed(this)).subscribe(img => {
      this.imgSrc = img;
    });
  }

  private setContentUrl(way: string): void {
    this.fireStorage.download(way).pipe(untilDestroyed(this)).subscribe(bookContent => {
      this.pdfSrc = bookContent;
    });
  }

  private async loadCurrentBookData() {
    this.book$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.booksService.getBook(params.get('id'));
      })
    );
    await this.book$.pipe(untilDestroyed(this)).subscribe(curBook => {
      this.currentBook = curBook;
      if (this.currentBook != undefined) {
        this.setImageUrl(this.currentBook.icon);
        this.setContentUrl(this.currentBook.content);
      }
    });
  }

  private initBookView() {
    this.bookView = {
      source: this.pdfSrc,
      page: (this.route.snapshot.paramMap.get('page')) ? +this.route.snapshot.paramMap.get('page') : 1,
      autosize: true,
      rendering: false,
      zoom:1,
      allPages: false,
    };
  }


  ngOnInit() {
    this.loadCurrentBookData();
    this.setCurrentUserInSession();
    setTimeout(() => {
          this.initBookView();
    }, 1000)
  }
  
  ngOnDestroy(): void {

  }
  
}

// Dialog component
@Component({
  selector: 'dialog-overview',
  templateUrl: 'dialog-overview.html',
  styleUrls: ['./detail-book.component.css']
})
export class DialogOverview {

  constructor(
    public dialogRef: MatDialogRef<DialogOverview>,
    @Inject(MAT_DIALOG_DATA) 
    public data: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
