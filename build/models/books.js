"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookStore = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const db_1 = __importDefault(require("../db"));
//CRUD actions for books table table
class bookStore {
    async index() {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM books';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get books. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM books WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find book ${id}. Error: ${err}`);
        }
    }
    async search(y) {
        try {
            const sql = 'SELECT * FROM books WHERE publication_date=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [y]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not find book in year ${y}. Error: ${err}`);
        }
    }
    async create(b) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'INSERT INTO books (title,publication_date,author,category,status) VALUES($1, $2, $3, $4, $5) RETURNING *;';
            const result = await conn.query(sql, [
                b.title,
                b.publication_date,
                b.author,
                b.category,
                b.status,
            ]);
            const books = result.rows[0];
            conn.release();
            return books;
        }
        catch (err) {
            throw new Error(`Could not add new book or book already exists in store ${b.title}. Error: ${err}`);
        }
    }
    async edit(b, id) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'UPDATE books SET title=$1, publication_date=$2 ,author=$3 , category=$4, status=$5  WHERE id=($6) RETURNING *;';
            const result = await conn.query(sql, [
                b.title,
                b.publication_date,
                b.author,
                b.category,
                b.status,
                id,
            ]);
            const book = result.rows[0];
            conn.release();
            return book;
        }
        catch (err) {
            throw new Error(`Could not edit book ${b.title}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM books WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            const book = result.rows[0];
            conn.release();
            return book;
        }
        catch (err) {
            throw new Error(`Could not delete book ${id}. Error: ${err}`);
        }
    }
}
exports.bookStore = bookStore;
