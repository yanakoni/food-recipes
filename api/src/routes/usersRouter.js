import { Router } from "express";
import { UserController} from "../controllers/userController.js";
export const usersRouter = new Router();
const userController = new UserController();

usersRouter.post('/signup', userController.singUp);
usersRouter.post('/signin', userController.singIn);
