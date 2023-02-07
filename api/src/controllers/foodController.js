import { PrismaClient } from '@prisma/client';
import humps from 'humps';

const prisma = new PrismaClient();

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 12;

class FoodController {
  async ingredients(req, res, next) {
    try {
      const skip = parseInt(req.query.skip) || DEFAULT_SKIP;
      const take = parseInt(req.query.limit) || DEFAULT_LIMIT;

      const [ingredientsCount, ingredients] = await Promise.all([
        prisma.ingredient.count(),
        prisma.ingredient.findMany({
          skip,
          take,
        }),
      ]);

      res.status(200).json({ data: humps.camelizeKeys(ingredients), count: ingredientsCount });
    } catch (e) {
      next(e);
    }
  }

  async createIngredient(req, res, next) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(401).json({
          message: 'Check the input data.',
        });
      }

      await prisma.ingredient.create({ data: { name } });

      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { category } = req.body;

      if (!category) {
        return res.status(401).json({
          message: 'Check the input data.',
        });
      }

      await prisma.category.create({ data: { name: category } });

      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  async meals(req, res, next) {
    try {
      const skip = parseInt(req.query.skip) || DEFAULT_SKIP;
      const take = parseInt(req.query.limit) || DEFAULT_LIMIT;
      const { category } = req.query;

      const args = {
        include: {
          ingredients: true,
        },
        skip,
        take,
      };

      if (category) {
        args.where = {
          category_name: category,
        };
      }

      const [mealsCount, meals] = await Promise.all([prisma.meal.count(), prisma.meal.findMany(args)]);

      res.status(200).json({ data: humps.camelizeKeys(meals), count: mealsCount });
    } catch (e) {
      next(e);
    }
  }

  async mealById(req, res, next) {
    try {
      let { id } = req.params;

      if (!id) {
        return res.status(401).json({
          message: "Can't find meal",
        });
      }

      const meal = await prisma.meal.findUnique({
        include: {
          ingredients: true,
        },
        where: {
          id: +id,
        },
      });

      res.status(200).json({ data: humps.camelizeKeys(meal) });
    } catch (e) {
      next(e);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await prisma.category.findMany();

      res.status(200).json({ data: humps.camelizeKeys(categories) });
    } catch (e) {
      next(e);
    }
  }
}

export { FoodController };
