import Event from '../Models/Event.js'
import Trail from "../Models/Trail.js";
import Location from '../Models/Location.js'
import Site from '../Models/Site.js'
import slugify from "slugify";
import { format ,parse} from 'date-fns';

export const eventController = {
    addEvent: async (req, res) => {
        const { trail, date, arrivalHr, cost, restaurants, tools, meetingPoints } = req.body

        try {
            if (!trail || !date  || !arrivalHr || !cost || !meetingPoints) {
                console.log("fields required")
                return res.status(400).json(req.body)
            }
            const trailFound = await Trail.findById(trail)
            if (!trailFound) {
                return res.status(404).json({ message: "Trail Not Found" })
            }
            const slug = slugify(`${trailFound.title} ${date}`, {
                lower: true,
            })
            const formattedDate = parse(date, 'yyyy-mm-dd', new Date());
            // const formattedArrivalHr = format(new Date(`2000-01-01T${arrivalHr}:00`), 'h:mm a');
            // const formattedMeetingPoints = meetingPoints.map(point => ({
            //     ...point,
            //     time: parse(point.time, 'H:mm', new Date())
            // }));

            const event = await Event.create({ trail, date:formattedDate, arrivalHr, 
                cost, status: "ongoing", restaurants :restaurants,
                 tools:tools, meetingPoints, slug })

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

            const Events = await Event.find().sort({ "createdAt": -1 }).populate('trail');
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
        const { id, trail, date, departureHr, arrivalHr, cost, restaurants, tools, meetingPoints } = req.body
        try {
            if (!id) {
                return res.status(400).json({ message: "You Should Provide The ID" })
            }
            const existingEvent = await Event.findById(id);

            if (!existingEvent) {
                return res.status(404).json({ message: "Event Doesn't Exist" });
            }
            if (trail) existingEvent.trail = trail;
            // if (date) existingEvent.date = date;
            if (departureHr) existingEvent.departureHr = departureHr;
            if (arrivalHr) existingEvent.arrivalHr = arrivalHr;
            if (cost) existingEvent.cost = cost;
            if (restaurants) existingEvent.restaurants = restaurants;
            if (tools) existingEvent.tools = tools;
            if (meetingPoints) existingEvent.meetingPoints = meetingPoints;

            if (date && existingEvent.date && new Date(date) > existingEvent.date) {
                existingEvent.status = 'postponed';
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
    getByFilter: async (req, res) => {
        const { location, difficulty, lengthInterval } = req.body
        let searchBy = {};
        if (location) {
            searchBy.location = location;
        }
        if (difficulty) {
            searchBy.difficulty = difficulty;
        }
        if (lengthInterval) {
            const [lowerBound, upperBound] = lengthInterval.split(',').map(Number);
            if (!isNaN(lowerBound) && !isNaN(upperBound)) {
                searchBy.length = { $gte: lowerBound, $lte: upperBound };
            } else {
                return res.status(400).json({ message: 'Invalid lengthInterval format' });
            }
        }

        try {
            const filteredTrails = await Trail.find(searchBy)
            if (filteredTrails) {
                const trailIds = filteredTrails.map(trail => trail._id);

                // Find events associated with the filtered trails
                const filteredEvents = await Event.find({ trail: { $in: trailIds } })
                    .populate('trail')
                    .exec();

                return res.status(200).json(filteredEvents)
            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    ,
    addUserToEvent: async (req, res) => {
        const { userId, eventId, meetingPoint } = req.body
        try {
            if (!eventId || !meetingPoint || !userId) {
                return res.status(400).json({ message: 'Please provide eventId, meetingPoint, and userId' });
              }

            const event=await Event.findById(eventId)
            if(!event){
                return res.status(404).json({ message: "Event Not Found" })
            }
            const isUserAlreadyAssigned = event.meetingPoints.some(point =>
                point.users.includes(userId)
            );
    
            if (isUserAlreadyAssigned) {
                return res.status(400).json({ message: 'User is already assigned to a meeting point in this event' });
            }
            const existingMeetingPoint = event.meetingPoints.find(point => point.meetingPoint === meetingPoint);

            if (!existingMeetingPoint) {
              return res.status(404).json({ message: 'Meeting point not found in the event' });
            }
            if (existingMeetingPoint.users.includes(userId)) {
                return res.status(400).json({ message: 'You Have already booked a place in this event' });
              }
              existingMeetingPoint.users.push(userId);
              const updatedEvent = await event.save();
              if(updatedEvent){
                return res.status(200).json({message:"Your Seat Is Booked Successfully"});
              }
              else{
                return res.status(400).json({message:" Error while Booking Your Seat. Please Try Again"});

              }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export default eventController;