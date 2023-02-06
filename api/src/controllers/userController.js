import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController {
  prisma = new PrismaClient();

  async singUp(req, res) {
    const { username, email, password } = req.body;

    try {
      const exist = await this.prisma.user.findFirst({
        where: {
          username,
          email,
        },
      });

      if (exist) {
        return res.status(409).json({
          message: 'User already exists. Please log in.',
        });
      }

      await this.prisma.user.create({
        data: {
          username,
          email,
          password: bcrypt.hashSync(password, parseInt(process.env.API_SECRET)),
        },
      });

      res.status(201).json({
        message: 'User successfully created.',
      });
    } catch (e) {
      console.error(e);

      res.status(400).json({
        message: 'Unexpected error.',
      });
    }
  }

  async singIn(req, res) {
    const { username, password } = req.body;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          username: username,
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
        user: {
          id: user.id,
          username: user.username,
        },
        accessToken,
      });
    } catch (e) {
      console.error(e);

      res.status(404).json({
        message: 'Unexpected error',
      });
    }
  }
}

export { UserController };
