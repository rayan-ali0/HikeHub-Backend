import Location from "../Models/Location.js";

export const locationController = {
    addLocation: async (req, res) => {
        const { name } = req.body

        try {
            if (!name ) {
                return res.status(400).json({ message: "Field name is required" })

            }
            const location = await Location.create({ name})
            if (location) {
                return res.status(200).json(location)
            }
            else {
                return res.status(400).json({ message: "Error Creating the Location" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getLocations: async (req, res) => {
        try {

            const Locations = await Location.find();
            if (Locations) {
                return res.status(200).json(Locations)
            }
            else {
                return res.status(400).json({ message: "No Locations Found" })

            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getLocation: async (req, res) => {
        const id = req.params.id
        try {
            const LocationFound = await Location.findById(id)
            if (LocationFound) {
                return res.status(200).json(LocationFound)
            }
            else {
                return res.status(400).json({ message: "Location Not Found" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    updateLocation: async (req, res) => {
        const { id, name} = req.body
        try {
            if (!id) {
                return res.status(400).json({ message: "You Should Provide The ID" })
            }
            const existingLocation = await Location.findById(id);

            if (!existingLocation) {
                return res.status(404).json({ message: "Location Doesn't Exist" });
            }
            if (name) existingLocation.name = name;

            const updatedLocation = await existingLocation.save();

            return res.status(200).json(updatedLocation);

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    deleteLocation: async (req, res) => {
        const id = req.params.id
        try {
            const LocationFound = await Location.findByIdAndDelete(id)
            if (LocationFound) {
                return res.status(200).json({ message: "Location deleted successfully" })
            }
            else {
                return res.status(400).json({ message: "Location Not Deleted" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,


}

export default locationController;