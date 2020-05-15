import { Injectable } from '@angular/core';
import { ID, Store, StoreConfig } from '@datorama/akita';
import { User } from '../../shared/interfaces/user';

//Інтерфейс об'єкту сховища
export interface SessionState {
   user: User | null;
}

// Функція створення початкового стану сховища
export function createInitialState(): SessionState {
  return {
    user: null
  };
}

//Створення сесії
export function createSession(user: User) {
  return { ...user };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {

  constructor() {
    super(createInitialState());
  }

  //Встановлення користувача у сесії, оновленя сховища
  login(data: User) {
    const user = createSession(data);
    this.update({ user });
  }

  //Встановлення початкового стану сховища
  logout() {
    this.update(createInitialState());
  }
}

