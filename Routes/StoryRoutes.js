import express from 'express'
import {storyController} from '../Controllers/StoryController.js'
import {verifyToken} from '../Middlwares/verifyToken.js'
import {checkRole} from '../Middlwares/verifyRole.js'
import uploadImage from '../Middlwares/Multer.js'
const storyRoutes = express.Router()

storyRoutes.post('/create',uploadImage.array('images'), storyController.addStory)
storyRoutes.get('/read',  storyController.getStories)
storyRoutes.get('/read/:id',  storyController.getStory)
storyRoutes.patch('/update/:id', verifyToken,checkRole(['organizer']),storyController.updateStory)
storyRoutes.delete('/delete/:id',verifyToken,checkRole(['organizer']), storyController.deleteStory)

export default storyRoutes