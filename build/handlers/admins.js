'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const auth_1 = require('../middlewares/auth');
const admins_1 = require('../models/admins');
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const store = new admins_1.adminStore();
const index = async (__req, res) => {
  const admins = await store.index();
  if (!admins.length) {
    res.status(404).json({ message: 'no admins are found!' });
  }
  res.json(admins);
};
const show = async (req, res) => {
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
const create = async (req, res) => {
  try {
    const admin = {
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
const update = async (req, res) => {
  try {
    const admin = {
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
const destroy = async (req, res) => {
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
const authenticate = async (req, res) => {
  try {
    const admin = {
      adminname: req.body.adminname,
      fullname: req.body.fullname,
      password: req.body.password,
    };
    const auth = await store.authenticate(admin.adminname, admin.password);
    //edited
    const token = jsonwebtoken_1.default.sign({ auth }, process.env.TOKEN_KEY);
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
const adminsRoutes = (app) => {
  app.get('/admins', index);
  app.post('/signin', authenticate);
  app.put('/admins/:id', auth_1.authvalidator, update);
  app.get('/admins/:id', show);
  app.post('/signup', create);
  app.delete('/admins/:id', auth_1.authvalidator, destroy);
};
exports.default = adminsRoutes;
