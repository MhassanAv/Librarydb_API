"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const dashbored_1 = require("../services/dashbored");
const dashBoard = new dashbored_1.libraryService();
//getting all availableBooks
const availableBooks = async (_req, res) => {
    try {
        const availableBooks = await dashBoard.availableBooks();
        res.json(availableBooks);
    }
    catch (error) {
        res.status(400).json({ massage: 'error!' });
    }
};
//getting all borrowedBooks
const borrowedBooks = async (_req, res) => {
    try {
        const borrowedBooks = await dashBoard.borrowedBooks();
        res.json(borrowedBooks);
    }
    catch (error) {
        res.status(400).json({ massage: 'error!' });
    }
};
//getting the books borrowed by a single user
const userBooks = async (_req, res) => {
    try {
        const data = await dashBoard.userBooks(_req.params.name);
        if (!data) {
            res.json({ msg: `no borrowed books by this user!${_req.params.name}` });
            return;
        }
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ massage: 'error!' });
    }
};
const DashboardService = (app) => {
    app.get('/available', auth_1.authvalidator, availableBooks);
    app.get('/borrowed', auth_1.authvalidator, borrowedBooks);
    app.get('/borrowed/:name', auth_1.authvalidator, userBooks);
};
exports.default = DashboardService;
