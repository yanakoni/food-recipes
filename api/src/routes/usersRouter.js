import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const usersRouter = new Router();
const userController = new UserController();

usersRouter.post('/sign-up', userController.singUp);
usersRouter.post('/sign-in', userController.singIn);
usersRouter.get('/ingredients', userController.userIngredients);
usersRouter.post('/ingredients', userController.addIngredient);

export { usersRouter };
