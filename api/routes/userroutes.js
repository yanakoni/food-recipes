import { Router } from "express";
import { UserController} from "../controllers/usercontroller.js";

export const router = new Router();
const userController = new UserController();

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser);
router.post('/users', userController.createUser);
router.put('/users', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
