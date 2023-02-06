import { Router } from 'express';
import { FoodController } from '../controllers/foodController.js';

const mealsRouter = new Router();
const mealController = new FoodController();

mealsRouter.get('/', mealController.meals);
mealsRouter.get('/:id', mealController.mealById);
mealsRouter.get('/:id/ingredients', mealController.ingredients);
mealsRouter.get('/v1/categories', mealController.getCategories);
mealsRouter.post('/v1/categories', mealController.createCategory);
mealsRouter.post('/v1/ingredients', mealController.createIngredient);

export { mealsRouter };
