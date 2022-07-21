'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.authvalidator = exports.hash = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const bcrypt_1 = __importDefault(require('bcrypt'));
const dotenv_1 = __importDefault(require('dotenv'));
// accessing token after login
dotenv_1.default.config();
//password hashing
const hash = (password) => {
  const pepper = process.env.BCRYPT_PASSWORD;
  const saltRound = process.env.SALT_ROUNDS;
  const hashed = bcrypt_1.default.hashSync(
    password + pepper,
    parseInt(saltRound)
  );
  return hashed;
};
exports.hash = hash;
//validating user after validating hashed password
//user_auth_id should be passed in every request in body to make sure that the user id
// of decoded token is the same as current user id
const authvalidator = (req, res, next) => {
  try {
    //adding token to http header instead of doing it maunally
    const authHeader = req.headers.authorization;
    if (authHeader == null) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    if (authHeader != null) {
      const bearer = authHeader.split(' ')[0].toLowerCase();
      const token = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decoded = jsonwebtoken_1.default.verify(
          token,
          process.env.TOKEN_KEY
        );
        if (decoded != null) {
          res.status(200);
          next();
        }
      }
    }
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
exports.authvalidator = authvalidator;
