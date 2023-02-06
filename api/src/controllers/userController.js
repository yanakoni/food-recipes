import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class UserController {
  async singUp(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Check the input data.',
      });
    }

    try {
      const exist = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (exist) {
        return res.status(409).json({
          message: 'User already exists. Please log in.',
        });
      }

      await prisma.user.create({
        data: {
          username,
          password: bcrypt.hashSync(password, parseInt(process.env.API_SECRET)),
        },
      });

      res.status(201).json({
        success: true,
        message: 'User successfully created.',
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  async singIn(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Check the input data.',
      });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found.',
        });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).json({
          accessToken: null,
          message: 'Invalid password.',
        });
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.API_SECRET,
        {
          expiresIn: '1h',
        }
      );

      res.status(200).json({
        id: user.id,
        username: user.username,
        accessToken,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  async userIngredients(req, res) {
    const username = req.query.user;
    console.log(username);
    if (!username) {
      return res.status(401).json({
        message: 'Invalid query.',
      });
    }
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
        include: {
          ingredients: true
        }
      });
      if(!user){
        return res.status(404).json({
          message: 'User not found.',
        });
      }
      res.status(200).json(user);
    }
    catch (e) {
      console.error(e);

      res.status(404).json({
        message: 'Unexpected error',
      });
    }
  }
}

export { UserController };
