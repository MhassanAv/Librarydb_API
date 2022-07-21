'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.adminStore = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const db_1 = __importDefault(require('../db'));
const bcrypt_1 = __importDefault(require('bcrypt'));
const dotenv_1 = __importDefault(require('dotenv'));
const auth_1 = require('../middlewares/auth');
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
//CRUD actions for admins table
class adminStore {
  async index() {
    try {
      // @ts-ignore
      const conn = await db_1.default.connect();
      const sql = 'SELECT * FROM admins';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get admins. Error: ${err}`);
    }
  }
  async authenticate(adminname, password) {
    // @ts-ignore
    const conn = await db_1.default.connect();
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
      if (bcrypt_1.default.compareSync(password + pepper, pass.password)) {
        return admin;
      }
    }
    return null;
  }
  async show(id) {
    try {
      const sql = 'SELECT * FROM admins WHERE id=($1)';
      // @ts-ignore
      const conn = await db_1.default.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      //const {...d} = result.rows[0];
      //nconsole.log(d.adminname);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find admin ${id}. Error: ${err}`);
    }
  }
  async create(a) {
    try {
      // @ts-ignore
      const conn = await db_1.default.connect();
      const sql =
        'INSERT INTO admins (adminname, fullname, password) VALUES($1, $2, $3) RETURNING *;';
      const result = await conn.query(sql, [
        a.adminname,
        a.fullname,
        (0, auth_1.hash)(a.password),
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
  async edit(a, id) {
    try {
      // @ts-ignore
      const conn = await db_1.default.connect();
      const sql =
        'UPDATE admins SET adminname=$1, fullname=$2, password=$3 WHERE id=($4) RETURNING *;';
      const result = await conn.query(sql, [
        a.adminname,
        a.fullname,
        (0, auth_1.hash)(a.password),
        id,
      ]);
      const admin = result.rows[0];
      conn.release();
      return admin;
    } catch (err) {
      throw new Error(`Could not edit admin. Error: ${err}`);
    }
  }
  async delete(id) {
    try {
      const sql = 'DELETE FROM admins WHERE id=($1)';
      // @ts-ignore
      const conn = await db_1.default.connect();
      const result = await conn.query(sql, [id]);
      const admin = result.rows[0];
      conn.release();
      return admin;
    } catch (err) {
      throw new Error(`Could not delete admin ${id}. Error: ${err}`);
    }
  }
}
exports.adminStore = adminStore;
