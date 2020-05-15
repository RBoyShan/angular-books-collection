import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../state/book.model';
import { BooksService } from '../state/books.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FirebaseCloudStorageService } from '../../shared/services/firebase-cloud-ctorage.service';
import { category } from '../../category';
import { SnackBar } from 'src/app/shared/snack-bar';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-create-book-data',
  templateUrl: './create-book-data.component.html',
  styleUrls: ['./create-book-data.component.css']
})
export class CreateBookDataComponent implements OnInit, OnDestroy {

  public categories = category;

  public postForm: FormGroup; 
  public photoUrl: string;

  private bookDataStorage = {
    content: '',
    icon: '',
  }

  constructor(
    private booksService: BooksService,
    private fireStorageService: FirebaseCloudStorageService,
    private builder: FormBuilder,
    private bar: SnackBar
  ) { }

  public async addBook(formData: Book) {
    let book = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      author: formData.author,
      countPages: formData.countPages,
      content: this.bookDataStorage.content,
      icon: this.bookDataStorage.icon,
    };

    this.photoUrl = '';

    this.booksService.addBook(book);
    this.postForm.reset();
    this.bar.openSnackBar('New book successfully added!', 'OK');
  }

  public addContent(content) {
    this.bookDataStorage.content = this.fireStorageService.upload(content,'filesPDF/');
  }

  public addIcon(icon) {
    this.bookDataStorage.icon = this.fireStorageService.upload(icon, 'images/')
    setTimeout(() => {
      this.fireStorageService.download(this.bookDataStorage.icon).pipe(untilDestroyed(this))
          .subscribe(url => {
            this.photoUrl = url;
          });
    }, 2000);
  }

  ngOnInit() {
    this.postForm = this.builder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      category: new FormControl('', Validators.required),
      author: new FormControl('', [Validators.required, Validators.minLength(5)]),
      countPages: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      icon: new FormControl('', Validators.required),
    });
  }
 
  ngOnDestroy() {
  
  }
}
