import { ID } from '@datorama/akita';

//Інтерфейс об'єкту книги
export interface Book {
  id?: ID;
  name: string;
  author: string;
  category: string[];
  description: string;
  content?: string;
  icon?: string;
  countPages: number;
}

//Фабрична функція для створення об'єкту книги
export function createBook(params: Partial<Book>) {
  return {

  } as Book;
}
