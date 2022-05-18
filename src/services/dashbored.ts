/* eslint-disable @typescript-eslint/ban-ts-comment */
import Client from '../db';
import { book } from '../models/books';

export type userBook = {
  user_name: string;
  books: string[];
};

export class libraryService {
  async borrowedBooks(): Promise<book[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(
        `SELECT * FROM books WHERE status='Borrowed';`
      );
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get borrowd books: ${err}`);
    }
  }

  async availableBooks(): Promise<book[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(
        `SELECT * FROM books WHERE status='Available';`
      );

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get Available books: ${err}`);
    }
  }

  async userBooks(username: string): Promise<userBook> {
    try {
      //@ts-ignore
      const conn = await Client.connect();

      const titles = await conn.query(
        `SELECT title FROM books INNER JOIN registrations ON books.id = registrations.book_id WHERE user_name = ($1);`,
        [username]
      );

      const userBooks: userBook = {
        user_name: username,
        books: titles.rows,
      };

      conn.release();

      return userBooks;
    } catch (err) {
      throw new Error(`unable get Available books: ${err}`);
    }
  }
}
