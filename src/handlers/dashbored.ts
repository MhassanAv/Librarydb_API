import express, { Request, Response } from 'express';
import { authvalidator } from '../middlewares/auth';
import { libraryService } from '../services/dashbored';

const dashBoard = new libraryService();

//getting all availableBooks

const availableBooks = async (_req: Request, res: Response) => {
  try {
    const availableBooks = await dashBoard.availableBooks();
    res.json(availableBooks);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};

//getting all borrowedBooks
const borrowedBooks = async (_req: Request, res: Response) => {
  try {
    const borrowedBooks = await dashBoard.borrowedBooks();
    res.json(borrowedBooks);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};

//getting the books borrowed by a single user
const userBooks = async (_req: Request, res: Response) => {
  try {
    const data = await dashBoard.userBooks(_req.params.name);
    if (!data) {
      res.json({ msg: `no borrowed books by this user!${_req.params.name}` });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};

const DashboardService = (app: express.Application) => {
  app.get('/available', authvalidator, availableBooks);
  app.get('/borrowed', authvalidator, borrowedBooks);
  app.get('/borrowed/:name', authvalidator, userBooks);
};

export default DashboardService;
