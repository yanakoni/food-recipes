import { Router } from "express";
import { FoodController } from "../controllers/foodController.js";
export const mealsRouter = new Router();
const mealController = new FoodController();

mealsRouter.get('/ingredients', mealController.ingredients);
mealsRouter.get('/meals', mealController.meals);
mealsRouter.get('/categories', mealController.getCategories);
