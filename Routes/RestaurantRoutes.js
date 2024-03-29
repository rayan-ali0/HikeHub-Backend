import express from 'express'
import {restaurantController} from '../Controllers/RestaurantController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'
import uploadImage from '../Middlwares/Multer.js'
const restaurantRoutes = express.Router()

restaurantRoutes.post('/create',uploadImage.single('image'), restaurantController.addRestaurant)
restaurantRoutes.get('/read', verifyToken,checkRole(['organizer']), restaurantController.getRestaurants)
restaurantRoutes.get('/read/:id', verifyToken,checkRole(['organizer']), restaurantController.getRestaurant)
restaurantRoutes.patch('/update/:id', uploadImage.single('image'),verifyToken,checkRole(['organizer']),restaurantController.updateRestaurant)
restaurantRoutes.delete('/delete/:id',verifyToken,checkRole(['organizer']), restaurantController.deleteRestaurant)

export default restaurantRoutes