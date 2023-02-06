import { Router } from 'express';
import { FoodController } from '../controllers/foodController.js';

const mealsRouter = new Router();
const mealController = new FoodController();

mealsRouter.get('/ingredients', mealController.ingredients);
mealsRouter.get('/', mealController.meals);
mealsRouter.get('/categories', mealController.getCategories);

export { mealsRouter };
