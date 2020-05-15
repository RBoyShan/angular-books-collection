import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Book } from '../state/book.model';
import { BooksService } from '../state/books.service';
import { BooksQuery } from '../state/books.query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseCloudStorageService } from '../../shared/services/firebase-cloud-ctorage.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { category } from '../../category';
import { SnackBar } from 'src/app/shared/snack-bar';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-edit-book-data',
  templateUrl: './edit-book-data.component.html',
  styleUrls: ['./edit-book-data.component.css']
})
export class EditBookDataComponent implements OnInit, OnDestroy {

  public photoUrl: string;
  public categories = category;
  public id: any = this.route.snapshot.paramMap.get('id');
  public currentBook: Book;
  private bookSubscription: Subscription;

  public postForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    category: new FormControl('', Validators.required),
    author: new FormControl('', [Validators.required, Validators.minLength(5)]),
    countPages: new FormControl('', Validators.required),
  });

  private bookDataStorage = {
    content: '',
    icon: '',
  }
  
  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private booksQuery: BooksQuery,
    private firebaseStorage: FirebaseCloudStorageService,
    private fireStorageService: FirebaseCloudStorageService,
    private location: Location,
    private router: Router,
    private bar: SnackBar
  ) { }

  public async updateBook(formData: Book) {
    this.currentBook = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      author: formData.author,
      countPages: formData.countPages,
    };

    this.booksService.updateBook(this.id, this.currentBook);
    this.bar.openSnackBar('Edit completed!', 'OK');
    
    setTimeout(() => {
      this.location.back();
    }, 2000);
  }

  public removeBook(id: any) {
    if(confirm('Are you sure to delete book?')) {
      this.removeBookDataFromStorage(id);
      this.booksService.removeBook(id);
      this.router.navigate(['books-list/']);
    }
  }

  public back() {
    this.location.back();
  }

  private async loadCurrentBook() {
    await new Promise(resolve => {
      this.bookSubscription = this.booksQuery.selectEntity(this.id).subscribe(curBook =>{
        this.currentBook = curBook;
        if (this.currentBook != undefined) {
            this.postForm.setValue({
              name: this.currentBook.name,
              description: this.currentBook.description,
              category: this.currentBook.category,
              author: this.currentBook.author,
              countPages: this.currentBook.countPages,
            })
            setTimeout(() => {
              this.fireStorageService.download(this.currentBook.icon).pipe(untilDestroyed(this))
                  .subscribe(url => {
                    this.photoUrl = url;
                  });
            }, 1000);
        }
        resolve();
      })
    });
  }

  private removeBookDataFromStorage(id: string) {
    this.firebaseStorage.delete(this.currentBook.icon);
    this.firebaseStorage.delete(this.currentBook.content);
  }

  ngOnInit() {
    if (this.id != undefined) {
      this.loadCurrentBook();
    }
  }
 
  ngOnDestroy() {
    if (this.id != undefined) {
      this.bookSubscription.unsubscribe();
    }
  }
}
