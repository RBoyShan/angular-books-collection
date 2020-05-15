import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Book } from '../state/book.model';
import { BooksService } from '../state/books.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-books',
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.css']
})
export class SearchBooksComponent implements OnInit {

  public books$: Observable<Book[]>
  public searchBox: FormControl = new FormControl('');
  private searchTerms = new Subject<string>();

  constructor(
    private booksService: BooksService,
  ) { }

  public searchBooks(term: string): void {
    this.searchTerms.next(term);
  }

  public reset() {
    this.searchBox.setValue('');
    this.searchBooks('');
  }

  ngOnInit(): void {
    this.books$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.booksService.searchBooks(term)),
    );
  }

}
