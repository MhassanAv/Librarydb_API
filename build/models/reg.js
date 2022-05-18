"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regStore = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const db_1 = __importDefault(require("../db"));
//CRUD actions for regs table
class regStore {
    async index() {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM registrations';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get registrations. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM registrations WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find reg ${id}. Error: ${err}`);
        }
    }
    async create(r) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const ifBorrowed = await conn.query(`SELECT status FROM books WHERE id=($1)`, [r.book_id]);
            if (ifBorrowed.rows[0].status == 'Borrowed') {
                conn.release();
                return;
            }
            const sql = 'INSERT INTO registrations (book_id,admin_id,user_name,return_date) VALUES($1, $2, $3,$4) RETURNING *;';
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
        }
        catch (err) {
            throw new Error(`Could not add new reg . Error: ${err}`);
        }
    }
    async returned(b_id) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = `UPDATE books SET status='Available' WHERE id=($1) RETURNING *;`;
            const result = await conn.query(sql, [b_id]);
            const reg = result.rows[0];
            conn.release();
            return reg;
        }
        catch (err) {
            throw new Error(`Could not return book ${b_id}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM registrations WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            const reg = result.rows[0];
            conn.release();
            return reg;
        }
        catch (err) {
            throw new Error(`Could not delete registration ${id}. Error: ${err}`);
        }
    }
}
exports.regStore = regStore;
