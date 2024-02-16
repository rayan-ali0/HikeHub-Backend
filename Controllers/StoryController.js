import Story from "../Models/Story.js";
import Event from '../Models/Event.js'

export const storyController = {
    addStory: async (req, res) => {
        const { title, description,eventId} = req.body
        const images = req.files.map(image => image.path);


        try {
            const event= await Event.findById(eventId)
            if (!event){
                return res.status(404).json({message:"Event Not Found"})
            }
            if (!title || !description || !images || images.length === 0) {
                return res.status(400).json({ message: "Fields are required" })

            }
            const story = await Story.create({ title, description, images ,date:event.date})
            if (story) {
                return res.status(200).json(story)
            }
            else {
                return res.status(400).json({ message: "Error Creating the Story" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getStories: async (req, res) => {
        try {

            const stories = await Story.find().sort({ createdAt: -1 });
            if (stories) {
                return res.status(200).json(stories)
            }
            else {
                return res.status(400).json({ message: "No Stories Found" })

            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getStory: async (req, res) => {
        const id = req.params.id
        try {
            const storyFound = await Story.findById(id)
            if (storyFound) {
                return res.status(200).json(storyFound)
            }
            else {
                return res.status(400).json({ message: "Story Not Found" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    updateStory: async (req, res) => {
        const { id, title, description } = req.body
        const images = req.files.map(image => image.path);
        try {
            if (!id) {
                return res.status(400).json({ message: "You Should Provide The ID" })
            }
            const existingStory = await Story.findById(id);

            if (!existingStory) {
                return res.status(404).json({ message: "Story Doesn't Exist" });
            }
            if (title) existingStory.title = title;
            if (description) existingStory.description = description;
            if (images && images.length > 0) existingStory.images = images;

            const updatedStory = await existingStory.save();

            return res.status(200).json(updatedStory);

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    deleteStory: async (req, res) => {
        const id = req.params.id

        try {

            const storyFound = await Story.findByIdAndDelete(id)
            if (storyFound) {
                return res.status(200).json({ message: "Story deleted successfully" })
            }
            else {
                return res.status(400).json({ message: "Story Not Deleted" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,


}

export default storyController;