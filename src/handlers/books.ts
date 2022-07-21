import express, { Request, Response } from 'express';
import { book, bookStore } from '../models/books';
import { authvalidator } from '../middlewares/auth';

const store = new bookStore();

const index = async (_req: Request, res: Response) => {
  const books = await store.index();
  if (!books.length) {
    res.status(404).json({ message: 'no books are found!' });
  }
  res.json(books);
};

const show = async (req: Request, res: Response) => {
  try {
    const book = await store.show(req.params.id);
    if (book) {
      res.json({
        msg: 'book found !',
        book: { ...book },
      });
    } else {
      res.status(404).json({
        msg: 'book not found!',
      });
    }
  } catch (err) {
    res.json({
      msg: 'there is an error',
      err,
    });
  }
};

const search = async (req: Request, res: Response) => {
  try {
    const books = await store.search(req.params.y);
    if (books.length !== 0) {
      res.json({
        msg: `${req.params.y}books found !`,
        book: { ...books },
      });
    } else {
      res.status(404).json({
        msg: 'books not found in the giving year!',
      });
    }
  } catch (err) {
    res.json({
      msg: 'there is an error',
      err,
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const book: book = {
      title: req.body.title,
      status: req.body.status,
      category: req.body.category,
      author: req.body.author,
      publication_date: req.body.publication_date,
    };

    const newbook = await store.create(book);
    res.json({
      msg: 'book created',
      book: { ...newbook },
    });
  } catch (err) {
    res.status(400);
    res.json({ msg: 'can not create book' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const book: book = {
      title: req.body.title,
      status: req.body.status,
      category: req.body.category,
      author: req.body.author,
      publication_date: req.body.publication_date,
    };
    const edited = await store.edit(book, req.params.id);
    res.json({
      msg: 'updated!',
      book: { ...edited },
    });
  } catch (err) {
    res.status(400).json('msg:something went wrong while updating !');
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.json({
      msg: 'there is an error',
      err,
    });
  }
};

const booksRoutes = (app: express.Application) => {
  app.get('/books', index);
  app.get('/books/:y', authvalidator, search);
  app.put('/books/:id', authvalidator, update);
  app.get('/books/:id', show);
  app.post('/books', authvalidator, create);
  app.delete('/books/:id', authvalidator, destroy);
};

export default booksRoutes;
