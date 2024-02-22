import express from 'express'
import {SubscriberController} from '../Controllers/SubscriberController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'

const subscriberRoutes = express.Router()

subscriberRoutes.post('/',SubscriberController.addSubscriber)
subscriberRoutes.get('/',verifyToken,checkRole(['organizer']),  SubscriberController.getSubscribers)

export default subscriberRoutes