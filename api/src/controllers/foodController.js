import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const PAGE_SIZE = 20;
export class FoodController {
    async ingredients(req, res) {
      const skip = parseInt(req.query.skip) || 0;
      const take = parseInt(req.query.take) || PAGE_SIZE;
        try {
            const ingredients = await prisma.ingredient.findMany({
              skip: skip,
              take: take,
            });
            res.status(200).json(ingredients);
        }
        catch (e) {
            console.warn(e);
            return res.status(400).json({
                message: "unexpected error"
            });
        }
    }
    async meals(req, res) {
      const skip = parseInt(req.query.skip) || 0;
      const take = parseInt(req.query.take) || PAGE_SIZE;
        try {
            const meals = await prisma.meal.findMany({
                include: {
                    ingredients: true
                },
                skip: skip,
                take: take,
            });
            res.status(200).json(meals);
        }
        catch (e) {
            console.warn(e);
            return res.status(400).json({
                message: "unexpected error"
            });
        }
    }

    async getCategories(req, res) {
      const skip = parseInt(req.query.skip) || 0;
      const take = parseInt(req.query.take) || PAGE_SIZE;
      const cats = await prisma.category.findMany({
        skip: skip,
        take: take,
      });
      res.status(200).json(cats);

    }
}
