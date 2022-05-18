import express, { Request, Response } from 'express';
import { authvalidator } from '../middlewares/auth';
import { admin, adminStore } from '../models/admins';
import jwt from 'jsonwebtoken';

const store = new adminStore();

const index = async (__req: Request, res: Response) => {
  const admins = await store.index();
  if (!admins.length) {
    res.status(404).json({ message: 'no admins are found!' });
  }
  res.json(admins);
};

const show = async (req: Request, res: Response) => {
  try {
    const admin = await store.show(req.params.id);
    if (admin) {
      res.json({
        msg: 'admin found !',
        admin: { ...admin },
      });
    } else {
      res.status(404).json({
        msg: 'admin not found!',
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
    const admin: admin = {
      adminname: req.body.adminname,
      fullname: req.body.fullname,
      password: req.body.password,
    };

    const newadmin = await store.create(admin);
    res.json({
      msg: 'admin created',
      admin: { ...newadmin },
    });
  } catch (err) {
    res.status(400);
    res.json({ msg: `can't create admin` });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const admin: admin = {
      adminname: req.body.adminname,
      fullname: req.body.fullname,
      password: req.body.password,
    };
    const edited = await store.edit(admin, req.params.id);
    res.json({
      msg: 'updated!',
      admin: edited,
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
const authenticate = async (req: Request, res: Response) => {
  try {
    const admin: admin = {
      adminname: req.body.adminname,
      fullname: req.body.fullname,
      password: req.body.password,
    };
    const auth = await store.authenticate(admin.adminname, admin.password);
    //edited
    const token = jwt.sign({ auth }, process.env.TOKEN_KEY as string);
    if (!auth) {
      return res.status(401).json({
        message: 'the adminname or password is invalid',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'the admin has ben authorized successfully',
        admin: { ...auth, token }, //we can hide the token for more scurity
      });
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const adminsRoutes = (app: express.Application) => {
  app.get('/admins', index);
  app.post('/signin', authenticate);
  app.put('/admins/:id', authvalidator, update);
  app.get('/admins/:id', show);
  app.post('/signup', create);
  app.delete('/admins/:id', authvalidator, destroy);
};

export default adminsRoutes;
