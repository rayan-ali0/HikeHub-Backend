import Event from '../Models/Event.js'
import Trail from "../Models/Trail.js";
import Location from '../Models/Location.js'
import Site from '../Models/Site.js'
import slugify from "slugify";
import { format, parse } from 'date-fns';
import User from '../Models/User.js';

export const eventController = {
    addEvent: async (req, res) => {
        const { trail, date, arrivalHr, cost, restaurants, tools, meetingPoints, maxSeats } = req.body

        try {
            if (!trail || !date || !arrivalHr || !cost || !meetingPoints) {
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
            // const formattedDate = parse(date, 'yyyy-mm-dd');
            const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
            const formattedDate = format(parsedDate, 'yyyy-MM-dd');
            console.log(formattedDate)
            const event = await Event.create({
                trail, date: formattedDate, arrivalHr,
                cost, status: "ongoing", restaurants: restaurants,
                tools: tools, meetingPoints, slug, maxSeats
            })

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

            const Events = await Event.find().sort({ "createdAt": -1 }).populate(['trail', 'restaurants.breakfast', 'restaurants.lunch', 'meetingPoints.users.user']);
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
    getOngoing: async (req, res) => {
        try {
            const currentDate = new Date();
            console.log(currentDate)
            const Events = await Event.find({ date: { $gt: currentDate } }).sort({ "createdAt": -1 }).populate(['trail', 'restaurants.breakfast', 'restaurants.lunch' , {path: 'trail', populate: 'location'}]);
            console.log(Events)
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
    },
    getUpcoming: async (req, res) => {
        try {

            const Events = await Event.find().sort({ "createdAt": -1 }).populate(['trail', 'restaurants.breakfast', 'restaurants.lunch']).limit(5);
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
            const EventFound = await Event.findById(id).populate(['trail', 'restaurants.breakfast', 'restaurants.lunch', 'meetingPoints.users.user',{path: 'trail', populate: 'location'}])
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
    },
    getSlug: async (req, res) => {
        const slug = req.params.slug
        try {
            const EventFound = await Event.findOne({ slug: slug }).populate(['trail', 'restaurants.breakfast', 'restaurants.lunch'])
            if (EventFound) {
                const totalUsersInEvent = EventFound.meetingPoints.reduce((total, point) => total + point.users.length, 0);
                // if (totalUsersInEvent >= EventFound.maxSeats) {
                //     return res.status(400).json({ message: 'No more seats available for the entire event' });
                // }
                return res.status(200).json({ event: EventFound, availableSeats: EventFound.maxSeats - totalUsersInEvent })
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
        const { id, trail, date, departureHr, arrivalHr, cost, restaurants, tools, meetingPoints, maxSeats } = req.body
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
            if (maxSeats) existingEvent.maxSeats = maxSeats

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
        if (location && location !== null) {
            searchBy.location = location;
        }
        if (difficulty && difficulty !== null) {
            searchBy.difficulty = difficulty;
        }
        if (lengthInterval) {
            const lowerBound = lengthInterval[0]
            const upperBound = lengthInterval[1]
            // const [lowerBound,upperBound] = lengthInterval.split(',').map(Number);
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
                const currentDate = new Date()
                // Find events associated with the filtered trails
                const filteredEvents = await Event.find({ trail: { $in: trailIds }, date: { $gt: currentDate } })
                    .populate(['trail', 'restaurants.breakfast', 'restaurants.lunch' , {path: 'trail', populate: 'location'}])
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

            const event = await Event.findById(eventId)
            if (!event) {
                return res.status(404).json({ message: "Event Not Found" })
            }
            const isUserAlreadyAssigned = event.meetingPoints.some(point =>
                point.users.some(user => user.user.toString() === userId)
            );

            if (isUserAlreadyAssigned) {
                return res.status(200).json({ status: 'error', message: 'You are already assigned to a meeting point in this event' });
            }
            const existingMeetingPoint = event.meetingPoints.find(point => point.meetingPoint === meetingPoint);

            if (!existingMeetingPoint) {
                return res.status(200).json({ status: 'error', message: 'Meeting point not found in the event' });
            }
            if (existingMeetingPoint.users.some(user => user.user === userId)) {
                return res.status(200).json({ status: 'error', message: 'You have already booked a place in this event' });
            }
            const totalUsersInEvent = event.meetingPoints.reduce((total, point) => total + point.users.length, 0);

            if (totalUsersInEvent >= event.maxSeats) {
                return res.status(200).json({ status: 'error', message: 'No more seats available for the entire event' });
            }

            existingMeetingPoint.users.push({ user: userId, paid: false });
            const updatedEvent = await event.save();
            if (updatedEvent) {
                return res.status(200).json({ message: "Your Seat Is Booked Successfully" });
            }
            else {
                return res.status(400).json({ status: 'error', message: " Error while Booking Your Seat. Please Try Again" });

            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    userPaid: async (req, res) => {
        const { userId, paidStatus, eventId } = req.body
        console.log(req.body)
        try {
            const userData = await User.findById(userId)
            const eventData = await Event.findById(eventId)

            if (!userData || !eventData) {
                return res.status(404).json({ message: "User Not Found" })
            }

            const isUserAssigned = eventData.meetingPoints.some(point =>
                point.users.some(user => user.user.toString() === userId)
            );
            if (!isUserAssigned) {
                console.log("shsh")
                return res.status(404).json({ message: "User Has not a seat in this event" })

            }
            console.log(eventData)
            // Update paid status for the user
            eventData.meetingPoints.forEach(point => {
                point.users.forEach(user => {
                    if (user.user.toString() === userId) {
                        user.paid = paidStatus; 
                        console.log(user)
                        // Set the paid status to true
                    }
                });
            });
            await eventData.save();
            return res.status(200).json({ message: "Paid status updated successfully" });

        }
        catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    }
}

export default eventController;