/* eslint-disable @typescript-eslint/ban-ts-comment */
import Client from '../db';
import { book } from '../models/books';

export type reg = {
  book_id: number;
  user_name: string;
  return_date: string;
  admin_id: number;
};

//CRUD actions for regs table

export class regStore {
  async index(): Promise<reg[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM registrations';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get registrations. Error: ${err}`);
    }
  }

  async show(id: string): Promise<reg> {
    try {
      const sql = 'SELECT * FROM registrations WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find reg ${id}. Error: ${err}`);
    }
  }

  async create(r: reg): Promise<reg | void> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

      const ifBorrowed = await conn.query(
        `SELECT status FROM books WHERE id=($1)`,
        [r.book_id]
      );

      if (ifBorrowed.rows[0].status == 'Borrowed') {
        conn.release();
        return;
      }

      const sql =
        'INSERT INTO registrations (book_id,admin_id,user_name,return_date) VALUES($1, $2, $3,$4) RETURNING *;';

      const result = await conn.query(sql, [
        r.book_id,
        r.admin_id,
        r.user_name,
        r.return_date,
      ]);

      await conn.query(`UPDATE books SET status ='Borrowed' WHERE id =($1)`, [
        r.book_id,
      ]);

      const reg = result.rows[0];

      conn.release();

      return reg;
    } catch (err) {
      throw new Error(`Could not add new reg . Error: ${err}`);
    }
  }

  async returned(b_id: string): Promise<book> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

      const sql = `UPDATE books SET status='Available' WHERE id=($1) RETURNING *;`;

      const result = await conn.query(sql, [b_id]);

      const reg = result.rows[0];

      conn.release();

      return reg;
    } catch (err) {
      throw new Error(`Could not return book ${b_id}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<reg> {
    try {
      const sql = 'DELETE FROM registrations WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const reg = result.rows[0];

      conn.release();

      return reg;
    } catch (err) {
      throw new Error(`Could not delete registration ${id}. Error: ${err}`);
    }
  }
}
