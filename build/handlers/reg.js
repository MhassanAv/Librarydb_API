"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reg_1 = require("../models/reg");
const auth_1 = require("../middlewares/auth");
const store = new reg_1.regStore();
const index = async (_req, res) => {
    try {
        const regs = await store.index();
        if (!regs.length) {
            res.status(404).json({ message: 'no regs are found!' });
        }
        res.json(regs);
    }
    catch (err) {
        res.json({
            msg: 'there is an error',
            err,
        });
    }
};
const show = async (req, res) => {
    try {
        const reg = await store.show(req.params.id);
        if (reg) {
            res.json({
                msg: 'reg found !',
                reg: { ...reg },
            });
        }
        else {
            res.status(404).json({
                msg: 'reg not found!',
            });
        }
    }
    catch (err) {
        res.json({
            msg: 'there is an error',
            err,
        });
    }
};
const create = async (req, res) => {
    try {
        const reg = {
            book_id: req.body.book_id,
            user_name: req.body.user_name,
            return_date: req.body.return_date,
            admin_id: req.body.admin_id,
        };
        const newreg = await store.create(reg);
        if (newreg == null) {
            res.status(400).json({ msg: 'Not Available !' });
            return;
        }
        res.json({
            msg: 'reg created',
            reg: { ...newreg },
        });
    }
    catch (err) {
        res.status(400).json({ msg: 'can not create reg' });
    }
};
const destroy = async (req, res) => {
    try {
        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    }
    catch (err) {
        res.json({
            msg: 'there is an error',
            err,
        });
    }
};
const returned = async (req, res) => {
    try {
        const returned = await store.returned(req.params.id);
        res.json({
            msg: 'Book Returned !',
            reg: { ...returned },
        });
    }
    catch (err) {
        res.json({
            msg: 'there is an error',
            err,
        });
    }
};
const regsRoutes = (app) => {
    app.get('/regs', auth_1.authvalidator, index);
    app.put('/return/:id', auth_1.authvalidator, returned);
    app.get('/regs/:id', auth_1.authvalidator, show);
    app.post('/regs', auth_1.authvalidator, create);
    app.delete('/regs/:id', auth_1.authvalidator, destroy);
};
exports.default = regsRoutes;
