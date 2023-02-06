import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PAGE_SIZE = 20;

class FoodController {
  async ingredients(req, res) {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || PAGE_SIZE;

    const ingredients = await prisma.ingredient.findMany({
      skip,
      take,
    });

    res.status(200).json(ingredients);
  }
  async meals(req, res) {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || PAGE_SIZE;

    const meals = await prisma.meal.findMany({
      include: {
        ingredients: true,
      },
      skip,
      take,
    });

    res.status(200).json(meals);
  }

  async getCategories(req, res) {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || PAGE_SIZE;

    const categories = await prisma.category.findMany({
      skip,
      take,
    });
    res.status(200).json(categories);
  }
}

export { FoodController };
