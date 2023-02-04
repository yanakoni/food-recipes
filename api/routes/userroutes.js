import { Router } from "express";
import { UserController} from "../controllers/usercontroller.js";
import {verifyToken} from "../middleware/jwtAuth.js";
export const router = new Router();
const userController = new UserController();

router.post('/test', userController.test);
router.post('/hello', verifyToken, userController.helloworld);
router.post('/signup', userController.singUp);
router.post('/signin', userController.singIn);
