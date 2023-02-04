import { Router } from "express";
import { UserController} from "../controllers/usercontroller.js";

export const router = new Router();
const userController = new UserController();

router.put('/signup', userController.singUp);
router.post('/signip', userController.singIn);
