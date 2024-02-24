import express from "express";
import { userController } from "../Controllers/UserController.js";
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'
import uploadImage from '../Middlwares/Multer.js'
export const userRoutes = express.Router();

userRoutes.post('/register',uploadImage.single("image"),userController.register);
userRoutes.get('/all',  userController.getAllUsers);
userRoutes.get('/:id', verifyToken,  userController.getUserById);
userRoutes.put('/:id',uploadImage.single("image"),verifyToken, userController.updateUserById);
userRoutes.delete('/:id',verifyToken,checkRole(['organizer']),  userController.deleteUserById);
userRoutes.get('/read/logged',verifyToken, userController.getOneUser);

export default userRoutes;  