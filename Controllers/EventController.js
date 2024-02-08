import Event from '../Models/Event.js'
import Trail from "../Models/Trail.js";
import Location from '../Models/Location.js'
import Site from '../Models/Site.js'

export const eventController = {
    addEvent: async (req, res) => {
        const { trail, date, departureHr, arrivalHr, cost, restaurants, tools,meetingPoints } = req.body

        try {
            if (!trail || !date || !departureHr || !arrivalHr || !cost  || !meetingPoints ) {
                return res.status(400).json({ message: "Fields are required" })

            }
            const event = await Event.create({ trail, date, departureHr, arrivalHr, cost, restaurants, tools,meetingPoints})
            if (event) {
                return res.status(200).json(event)
            }
            else {
                return res.status(400).json({ message: "Error Creating the Event" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getEvents: async (req, res) => {
        try {

            const Events = await Event.find().sort({"createdAt":-1});
            if (Events) {
                return res.status(200).json(Events)
            }
            else {
                return res.status(400).json({ message: "No Events Found" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getEvent: async (req, res) => {
        const id = req.params.id
        try {
            const EventFound = await Event.findById(id)
            if (EventFound) {
                return res.status(200).json(EventFound)
            }
            else {
                return res.status(400).json({ message: "Event Not Found" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    updateEvent: async (req, res) => {
        const { id, title, description, length, seaLevel, walkingTime, difficulty, sites, location } = req.body
        const images = req.files.map((image) => image.path);
        try {
            if (!id) {
                return res.status(400).json({ message: "You Should Provide The ID" })
            }
            const existingEvent = await Event.findById(id);

            if (!existingEvent) {
                return res.status(404).json({ message: "Event Doesn't Exist" });
            }
            if (title) existingEvent.title = title;
            if (description) existingEvent.description = description;
            if (images) existingEvent.images = images;
            if (length) existingEvent.length = length;
            if (seaLevel) existingEvent.seaLevel = seaLevel;
            if (walkingTime) existingEvent.walkingTime = walkingTime;
            if (difficulty) existingEvent.difficulty = difficulty;

            if (location) {
                const locationExist = await Location.findById(location)
                if (locationExist) {
                    existingEvent.location = location
                } else {
                    return res.status(404).json({ message: "This Location doesn't Exist" })
                }
            }
            if (sites && sites.length > 0) {
                for (let i = 0; i < sites.length; i++) {
                    const siteExists = await Site.findById(sites[i]);

                    if (!siteExists) {
                        return res.status(400).json({ message: `Invalid site reference at index ${i}` });
                    }
                }
                existingEvent.sites = sites;

            }
            const updatedEvent = await existingEvent.save();

            return res.status(200).json(updatedEvent);

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    deleteEvent: async (req, res) => {
        const id = req.params.id

        try {

            const EventFound = await Event.findByIdAndDelete(id)
            if (EventFound) {
                return res.status(200).json({ message: "Event deleted successfully" })
            }
            else {
                return res.status(400).json({ message: "Event Not Deleted" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,


}

export default eventController;