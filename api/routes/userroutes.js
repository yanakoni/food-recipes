import { Router } from "express";
import  UserController  from "../controllers/usercontroller";

const router = new Router();


router.get('/getusers', UserController.getUsers);
router.get('/getsingleuser/:id', UserController.getUser);
router.post('/createuser', UserController.createUser);
router.put('/updateuser', UserController.updateUser);
router.delete('/deleteuser/::id', UserController.deleteUser);

module.exports = router