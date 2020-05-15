import { Injectable } from '@angular/core';
import { Query, toBoolean } from '@datorama/akita';
import { filter, map } from 'rxjs/operators';
import { SessionStore, SessionState } from './session.store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionQuery extends Query<SessionState> {

  //Статус сховища (Наглядач за станом сховищя)
  public isLoggedIn$: Observable<boolean> = this.select(({ user }) => toBoolean(user));

  //Статус сховища (Наглядач за ім'ям користувача)
  public loggedInUser$: Observable<string> = this.select()
  .pipe(
    filter(({ user }) => toBoolean(user)),
    map(({ user: { displayName: name } }) => `${name}`)
  );

  constructor(protected store: SessionStore) {
    super(store);
  }

  //Статус сховища (повертає логічне значення)
  public isLoggedIn(): boolean {
    return toBoolean(this.getValue().user);
  }
}
