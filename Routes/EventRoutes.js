import express from 'express'
import {eventController} from '../Controllers/EventController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'

const eventRoutes = express.Router()

eventRoutes.post('/create', verifyToken,checkRole(['organizer']),eventController.addEvent)
eventRoutes.get('/read',  eventController.getEvents)
eventRoutes.get('/read/:id',  eventController.getEvent)
eventRoutes.patch('/update/:id', verifyToken,checkRole(['organizer']),eventController.updateEvent)
eventRoutes.delete('/delete/:id',verifyToken,checkRole(['organizer']), eventController.deleteEvent)
eventRoutes.get('/filter',eventController.getByFilter)
eventRoutes.put('/addUser',verifyToken ,checkRole(['user','organizer']),eventController.addUserToEvent )
export default eventRoutes