import express from 'express'
import {locationController} from '../Controllers/LocationController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'

const locationRoutes = express.Router()

locationRoutes.post('/create', verifyToken,checkRole(['organizer']),locationController.addLocation)
locationRoutes.get('/read',  locationController.getLocations)
locationRoutes.get('/read/:id',  locationController.getLocation)
locationRoutes.patch('/update/:id', verifyToken,checkRole(['organizer']),locationController.updateLocation)
locationRoutes.delete('/delete/:id',verifyToken,checkRole(['organizer']), locationController.deleteLocation)

export default locationRoutes