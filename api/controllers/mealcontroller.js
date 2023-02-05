import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const PAGE_SIZE = 20;
export class MealController {
    async ingredients(req, res) {
        const skip = req.query.skip || 0;
        const take = req.query.take || PAGE_SIZE;
        try {
            const ingredients = await prisma.ingredient.findMany({
                skip: parseInt(skip),
                take: parseInt(take)
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
        const skip = req.query.skip || 0;
        const take = req.query.take || PAGE_SIZE;
        try {
            const meals = await prisma.meal.findMany({
                include: {
                    ingredients: true   
                },
                skip: parseInt(skip),
                take: parseInt(take)
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
}