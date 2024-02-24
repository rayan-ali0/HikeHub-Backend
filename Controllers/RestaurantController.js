import Restaurant from "../Models/Restaurant.js";

export const restaurantController = {
    addRestaurant: async (req, res) => {
        const { name, description } = req.body
        const image= req.file.path

        try {
            if (!name || !description || !image ) {
                return res.status(400).json({ message: "Fields are required" })

            }
            const restaurant = await Restaurant.create({ name, description, image })
            if (restaurant) {
                return res.status(200).json(restaurant)
            }
            else {
                return res.status(400).json({ message: "Error Creating the Restaurant" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getRestaurants: async (req, res) => {
        try {

            const restaurants = await Restaurant.find();
            if (restaurants) {
                return res.status(200).json(restaurants)
            }
            else {
                return res.status(400).json({ message: "No Restaurants Found" })

            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getRestaurant: async (req, res) => {
        const id = req.params.id
        try {
            const RestaurantFound = await Restaurant.findById(id)
            if (RestaurantFound) {
                return res.status(200).json(RestaurantFound)
            }
            else {
                return res.status(400).json({ message: "Restaurant Not Found" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    updateRestaurant: async (req, res) => {
        const {id}=req.params
        const {  name, description } = req.body
        const image = req.file?.path;
        console.log(req.body)
        try {
            if (!id) {
                return res.status(400).json({ message: "You Should Provide The ID" })
            }
            const existingRestaurant = await Restaurant.findById(id);

            if (!existingRestaurant) {
                return res.status(404).json({ message: "Restaurant Doesn't Exist" });
            }
            if (name) existingRestaurant.name = name;
            if (description) existingRestaurant.description = description;
            if (image) existingRestaurant.image = image;

            const updatedRestaurant = await existingRestaurant.save();

            return res.status(200).json(updatedRestaurant);

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    deleteRestaurant: async (req, res) => {
        const id = req.params.id

        try {

            const RestaurantFound = await Restaurant.findByIdAndDelete(id)
            if (RestaurantFound) {
                return res.status(200).json({ message: "Restaurant deleted successfully" })
            }
            else {
                return res.status(400).json({ message: "Restaurant Not Deleted" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,


}

export default restaurantController;