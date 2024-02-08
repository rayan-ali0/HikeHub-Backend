import express from 'express'
import {trailController} from '../Controllers/TrailController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'

const trailRoutes = express.Router()

trailRoutes.post('/create', verifyToken,checkRole(['organizer']),trailController.addTrail)
trailRoutes.get('/read',  trailController.getTrails)
trailRoutes.get('/read/:id',  trailController.getTrail)
trailRoutes.patch('/update/:id', verifyToken,checkRole(['organizer']),trailController.updateTrail)
trailRoutes.delete('/delete/:id',verifyToken,checkRole(['organizer']), trailController.deleteTrail)

export default trailRoutes