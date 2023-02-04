import { Router } from "express";
import { UserController} from "../controllers/usercontroller.js";

export const router = new Router();
const userController = new UserController();

router.get('/getusers', userController.getUsers);
router.get('/getsingleuser/:id', userController.getUser);
router.post('/createuser', userController.createUser);
router.put('/updateuser', userController.updateUser);
router.delete('/deleteuser/:id', userController.deleteUser);
