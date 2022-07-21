'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.libraryService = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const db_1 = __importDefault(require('../db'));
class libraryService {
  async borrowedBooks() {
    try {
      //@ts-ignore
      const conn = await db_1.default.connect();
      const result = await conn.query(
        `SELECT * FROM books WHERE status='Borrowed';`
      );
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get borrowd books: ${err}`);
    }
  }
  async availableBooks() {
    try {
      //@ts-ignore
      const conn = await db_1.default.connect();
      const result = await conn.query(
        `SELECT * FROM books WHERE status='Available';`
      );
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get Available books: ${err}`);
    }
  }
  async userBooks(username) {
    try {
      //@ts-ignore
      const conn = await db_1.default.connect();
      const titles = await conn.query(
        `SELECT title FROM books INNER JOIN registrations ON books.id = registrations.book_id WHERE user_name = ($1);`,
        [username]
      );
      const userBooks = {
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
exports.libraryService = libraryService;
