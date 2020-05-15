import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SessionService } from '../state/session.service';
import { User } from '../../shared/interfaces/user';
import { BookMark } from 'src/app/shared/interfaces/bookmarks';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FirebaseCloudStorageService } from 'src/app/shared/services/firebase-cloud-ctorage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  public currentUser: User
  public collumns: string[] = ['bookName','bookId','page', 'description', 'link', 'delete'];
  public dataSource: MatTableDataSource<BookMark>;

  @ViewChild('scheduledBookMarksPaginator') paginator: MatPaginator;

  constructor(
    private session: SessionService,
    private fireStorage: FirebaseCloudStorageService
  ) { }

  public deleteBookMark(item: BookMark) {
    this.currentUser.bookmarks = this.currentUser.bookmarks.filter(mark => mark !== item);
    this.session.updateUserData(this.currentUser);
  }

  public changeUserPhoto(event) {
    if(event.target.files[0]){
      const imageUrl = this.fireStorage.upload(event, 'userPhoto/');
      setTimeout(() => {
        this.setUserPhoto(imageUrl);
      }, 2000);
    }
  }

  private setUserPhoto(way: string) {
    this.fireStorage.download(way).subscribe(url => {
      this.session.updateUserPhotoUrl(url);
    });
  }

  ngOnInit(): void {
    this.session.getUserData().pipe(untilDestroyed(this)).subscribe(user => {
      this.currentUser = user;
      this.dataSource = new MatTableDataSource<BookMark>(user.bookmarks);
      setTimeout(() => this.dataSource.paginator = this.paginator, 1000);
    });     
  }
  
  ngOnDestroy(): void {
    
  }

}
