import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
// accessing token after login

dotenv.config();
//password hashing
export const hash = (password: string): string => {
  const pepper = process.env.BCRYPT_PASSWORD as string;
  const saltRound = process.env.SALT_ROUNDS as string;
  const hashed = bcrypt.hashSync(password + pepper, parseInt(saltRound));
  return hashed;
};
//validating user after validating hashed password
//user_auth_id should be passed in every request in body to make sure that the user id
// of decoded token is the same as current user id
export const authvalidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
        const decoded = jwt.verify(
          token,
          process.env.TOKEN_KEY as unknown as string
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
