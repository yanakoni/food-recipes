import { Router } from 'express';
import { FoodController } from '../controllers/foodController.js';
import { verifyToken } from '../middlewares/jwtAuth.js';

const mealsRouter = new Router();
const mealController = new FoodController();

mealsRouter.get('/', mealController.meals);
mealsRouter.get('/:id', mealController.mealById);
mealsRouter.get('/v1/ingredients', mealController.ingredients);
mealsRouter.get('/v1/categories', mealController.getCategories);
mealsRouter.use(verifyToken);
mealsRouter.post('/v1/category', mealController.createCategory);
mealsRouter.post('/v1/ingredient', mealController.createIngredient);

export { mealsRouter };
