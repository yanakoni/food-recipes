import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const usersRouter = new Router();
const userController = new UserController();

usersRouter.post('/sign-up', userController.singUp);
usersRouter.post('/sign-in', userController.singIn);
//TODO: jwt token validator for adding ingredients
usersRouter.get('/ingredients', userController.userIngredients);
usersRouter.post('/ingredient', userController.addIngredient);

export { usersRouter };
