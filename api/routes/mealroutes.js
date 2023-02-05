import { Router } from "express";
import { MealController } from "../controllers/mealcontroller.js";
import {verifyToken} from "../middleware/jwtAuth.js";
export const mealrouter = new Router();
const mealController = new MealController();

mealrouter.get('/ingredients', mealController.ingredients);
mealrouter.get('/meals', mealController.meals);
