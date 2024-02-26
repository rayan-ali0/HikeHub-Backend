import express from 'express'
import {eventController} from '../Controllers/EventController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'

const eventRoutes = express.Router()

eventRoutes.post('/create', eventController.addEvent)
eventRoutes.get('/read',  verifyToken,checkRole(['organizer']), eventController.getEvents)
eventRoutes.get('/ongoing',  eventController.getOngoing)
eventRoutes.get('/getUpcoming',  eventController.getUpcoming)
eventRoutes.get('/read/:id',  eventController.getEvent)
eventRoutes.get('/slug/:slug',  eventController.getSlug)
eventRoutes.patch('/update/:id', verifyToken,checkRole(['organizer']),eventController.updateEvent)
eventRoutes.delete('/delete/:id',verifyToken,checkRole(['organizer']), eventController.deleteEvent)
eventRoutes.post('/filter',eventController.getByFilter)
eventRoutes.put('/addUser',eventController.addUserToEvent )
eventRoutes.patch('/userPaid',eventController.userPaid )


export default eventRoutes