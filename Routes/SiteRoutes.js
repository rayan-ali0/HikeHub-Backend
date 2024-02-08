import express from 'express'
import {siteController} from '../Controllers/SiteController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'

const siteRoutes = express.Router()

siteRoutes.post('/create', verifyToken,checkRole(['organizer']),siteController.addSite)
siteRoutes.get('/read',  siteController.getSites)
siteRoutes.get('/read/:id',  siteController.getSite)
siteRoutes.patch('/update/:id', verifyToken,checkRole(['organizer']),siteController.updateSite)
siteRoutes.delete('/delete/:id',verifyToken,checkRole(['organizer']), siteController.deleteSite)

export default siteRoutes