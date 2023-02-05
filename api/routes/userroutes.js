import { Router } from "express";
import { UserController} from "../controllers/usercontroller.js";
import {verifyToken} from "../middleware/jwtAuth.js";
export const userrouter = new Router();
const userController = new UserController();

userrouter.post('/signup', userController.singUp);
userrouter.post('/signin', userController.singIn);
