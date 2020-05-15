import { Injectable } from '@angular/core';
import { BooksStore } from './books.store';
import { BooksQuery } from './books.query';
import { Book } from './book.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { syncCollection } from '../../shared/sync-collection';
import { Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class BooksService {

  //Колекція Firebase Cloud Firestore
  private collection = this.db.collection('books');
  
  constructor(
    private booksQuery: BooksQuery,
    private booksStore: BooksStore,
    private db: AngularFirestore
    ) {
  }

  //Пыдключення до Firebase Cloud FireStore
  public connect(): Observable<any> {
    return syncCollection(this.collection, this.booksStore);
  }

  //Додавання нової книги
  public addBook(book: Book): void {
    this.collection.add(book);
  }

  //Видалення книги
  public removeBook(id: string): void {
    this.collection.doc(id).delete();
  }

  //Оновлення даних книги
  public updateBook(id: string, newData: any): void {
    this.collection.doc(id).update(newData);
  }

  //Повернення спостерігаємого на книгу по ID
  public getBook(id: string): Observable<Book> {
    if(this.booksQuery.hasEntity(id)){
      return this.booksQuery.selectEntity(id);
    }
    else {
      return of();
    }
  }

  //Повернення спостерігаємого на масив книг
  public getBooks(): Observable<Book[]> {
    return this.booksQuery.selectAll({sortBy: 'name'});
  }

  //Фільтрація по категорії
  public getBooksByCategory(category: string): Observable<Book[]> {
    if(!category) {
      return this.getBooks();
    }
    return this.booksQuery.selectAll({
      filterBy: entity => entity.category.includes(category)
    });
  }

  //Фільтрація по назві
  public searchBooks(term: string): Observable<Book[]> {
    if(!term.trim()) {
      return of([]);
    }

    return this.booksQuery.selectAll({
      filterBy: entity => entity.name.toLowerCase().indexOf(term.toLowerCase()) !== -1,
      limitTo: 5
    });
  }
}
