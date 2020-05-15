import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Book } from '../state/book.model';
import { BooksService } from '../state/books.service';
import { FirebaseCloudStorageService } from 'src/app/shared/services/firebase-cloud-ctorage.service';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { TooltipPosition } from '@angular/material/tooltip'; 

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit, OnDestroy {

  public books$: Observable<Book[]>;
  public photosUrls: Map<string, string> = null;
  public position: TooltipPosition = "below";

  constructor(
    private booksService: BooksService,
    private route: ActivatedRoute,
    private fireStorageService: FirebaseCloudStorageService
   ) { }

  private loadPhotos(): Map<string, string> {
    this.photosUrls = new Map();
    this.books$.pipe(untilDestroyed(this)).subscribe(books => {
      books.forEach(element => {
        this.fireStorageService.download(element.icon).subscribe(url => {
          this.photosUrls.set(element.id.toString(), url);
        })
      });
    });
    return this.photosUrls;
  }


  ngOnInit(): void {
    this.books$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.booksService.getBooksByCategory(params.get('category')))
    );
    setTimeout(() => {
      this.loadPhotos();
    },1000)
  }

  trackByFn(i, book) {
    return book.id;
  }

  ngOnDestroy(): void {
        
  }

}
