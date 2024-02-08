import express from "express";
import { userController } from "../Controllers/UserController.js";
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'
export const userRoutes = express.Router();

userRoutes.post('/register',userController.register);
userRoutes.get('/all', verifyToken,checkRole(['organizer']), userController.getAllUsers);
userRoutes.get('/:id', verifyToken,  userController.getUserById);
userRoutes.put('/:id', verifyToken, userController.updateUserById);
userRoutes.delete('/:id',verifyToken,checkRole(['organizer']),  userController.deleteUserById);
userRoutes.get('/read/logged',verifyToken, userController.getOneUser);

export default userRoutes;