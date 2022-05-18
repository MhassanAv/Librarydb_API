/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Client from '../db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { hash } from '../middlewares/auth';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;

export type admin = {
  adminname: string;
  fullname: string;
  password: string;
};

//CRUD actions for admins table

export class adminStore {
  async index(): Promise<admin[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM admins';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get admins. Error: ${err}`);
    }
  }

  async authenticate(
    adminname: string,
    password: string
  ): Promise<admin | null> {
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'SELECT password FROM admins WHERE adminname=($1)';

    const result = await conn.query(sql, [adminname]);
    const adminInfo = await conn.query(
      'SELECT * FROM admins WHERE adminname=($1)',
      [adminname]
    );

    conn.release();

    if (result.rows.length) {
      const pass = result.rows[0];
      const admin = adminInfo.rows[0];

      if (bcrypt.compareSync(password + pepper, pass.password)) {
        return admin;
      }
    }

    return null;
  }

  async show(id: string): Promise<admin> {
    try {
      const sql = 'SELECT * FROM admins WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      //const {...d} = result.rows[0];
      //nconsole.log(d.adminname);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find admin ${id}. Error: ${err}`);
    }
  }

  async create(a: admin): Promise<admin> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

      const sql =
        'INSERT INTO admins (adminname, fullname, password) VALUES($1, $2, $3) RETURNING *;';

      const result = await conn.query(sql, [
        a.adminname,
        a.fullname,
        hash(a.password),
      ]);

      const admin = result.rows[0];

      conn.release();

      return admin;
    } catch (err) {
      throw new Error(
        `Could not add new admin or adminname is already in use ${a.adminname}. Error: ${err}`
      );
    }
  }

  async edit(a: admin, id: string): Promise<admin> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

      const sql =
        'UPDATE admins SET adminname=$1, fullname=$2, password=$3 WHERE id=($4) RETURNING *;';

      const result = await conn.query(sql, [
        a.adminname,
        a.fullname,
        hash(a.password),
        id,
      ]);

      const admin = result.rows[0];

      conn.release();

      return admin;
    } catch (err) {
      throw new Error(`Could not edit admin. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<admin> {
    try {
      const sql = 'DELETE FROM admins WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const admin = result.rows[0];

      conn.release();

      return admin;
    } catch (err) {
      throw new Error(`Could not delete admin ${id}. Error: ${err}`);
    }
  }
}
