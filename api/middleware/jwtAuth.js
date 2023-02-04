import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const verifyToken = async (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
      if (err) req.user = undefined;
         prisma.user.findUnique({
        where: {
            username: username
        }
      }).exec((err, user) => {
          if (err) {
            res.status(500)
              .send({
                message: err
              });
          } else {
            req.user = user;
            next();
          }
        })
    });
  } else {
    req.user = undefined;
    next();
  }
};
