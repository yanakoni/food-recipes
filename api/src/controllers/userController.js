import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import humps from 'humps';

const prisma = new PrismaClient();

class UserController {
  async singUp(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({
        message: 'Check the input data.',
      });
    }

    try {
      const userExists = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (userExists) {
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
      return res.status(401).json({
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
          expiresIn: '10s',
        }
      );

      const refreshToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.API_REFRESH_SECRET,
        {
          expiresIn: '30d',
        }
      );

      res.status(200).json({
        data: {
          id: user.id,
          username: user.username,
          accessToken,
          refreshToken,
        },
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  async userIngredients(req, res, next) {
    const { username } = req.query;

    if (!username) {
      return res.status(401).json({
        message: "Can't find your data.",
      });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
        include: {
          ingredients: {
            select: {
              ingredient_name: true,
              measure: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found.',
        });
      }

      res.status(200).json({
        data: humps.camelizeKeys(user.ingredients),
        count: user.ingredients.length,
      });
    } catch (e) {
      next(e);
    }
  }

  // only 1 ingredient by request
  async addIngredient(req, res, next) {
    try {
      const { username, ingredient } = req.body;

      const userIngredient = await prisma.user_ingredients.findFirst({
        where: {
          user_name: username,
          ingredient_name: ingredient.ingredientName,
        },
      });

      if (!userIngredient) {
        await prisma.user_ingredients.create({
          data: {
            ingredient: {
              connectOrCreate: {
                where: {
                  name: ingredient.ingredientName,
                },
                create: {
                  name: ingredient.ingredientName,
                },
              },
            },
            user: {
              connect: {
                username: username,
              },
            },
            measure: ingredient.measure,
          },
        });
      } else {
        await prisma.user_ingredients.update({
          where: {
            id: userIngredient.id,
          },
          data: {
            measure: ingredient.measure,
          },
        });
      }

      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  }
}

export { UserController };
