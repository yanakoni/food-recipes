import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/jwtAuth.js';

const usersRouter = new Router();
const userController = new UserController();

usersRouter.post('/sign-up', userController.singUp);
usersRouter.post('/sign-in', userController.singIn);
usersRouter.use(verifyToken);
usersRouter.get('/ingredients', userController.userIngredients);
usersRouter.post('/ingredient', userController.addIngredient);

export { usersRouter };
