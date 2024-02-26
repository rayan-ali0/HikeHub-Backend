import Trail from "../Models/Trail.js";
import Location from '../Models/Location.js'
import Site from '../Models/Site.js'
import slugify from "slugify";

export const trailController = {
    addTrail: async (req, res) => {
        const { title, description, length, seaLevel, walkingTime, difficulty, sitess, location } = req.body
        const images = req.files.map(image => image.path)
        // console.log(sitess)
        const sites = JSON.parse(sitess)
        console.log("bodyy",req.body)
        console.log("file",req.files)
        try {
            if (!title || !description || !length || !seaLevel || !walkingTime || !images || !(images.length > 0) || !difficulty) {
                console.log("Fields are required")

                return res.status(400).json({ message: "Fields are required" })

            }
            const titleExist = await Trail.findOne({ title:title })
            if (titleExist) {
                console.log("Trail Name Already Exist")
                return res.status(400).json({ meesage: "Trail Name Already Exist" })
            }
            const slug = slugify(title, { lower: true })
            const trail = await Trail.create({ title, description, length, seaLevel, walkingTime, difficulty, sites, location, images, slug })
            if (trail) {
                console.log("Done")

                return res.status(200).json(trail)
            }
            else {
                console.log("eroor")

                return res.status(400).json({ message: "Error Creating the Trail" })

            }
        }
        catch (error) {
            console.log("catch")

            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getTrails: async (req, res) => {
        try {

            const trails = await Trail.find().populate(['sites', 'location']);
            if (trails) {
                return res.status(200).json(trails)
            }
            else {
                return res.status(400).json({ message: "No Trails Found" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getTrail: async (req, res) => {
        const id = req.params.id
        try {
            const TrailFound = await Trail.findById(id).populate(['sites', 'location'])
            if (TrailFound) {
                return res.status(200).json(TrailFound)
            }
            else {
                return res.status(400).json({ message: "Trail Not Found" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    updateTrail: async (req, res) => {
        const { id, title, description, length, seaLevel, walkingTime, difficulty, sites, location } = req.body
        const images = req.files.map((image) => image.path);
        try {
            if (!id) {
                return res.status(400).json({ message: "You Should Provide The ID" })
            }
            const existingTrail = await Trail.findById(id);

            if (!existingTrail) {
                return res.status(404).json({ message: "Trail Doesn't Exist" });
            }
            if (title) existingTrail.title = title;
            if (description) existingTrail.description = description;
            if (images) existingTrail.images = images;
            if (length) existingTrail.length = length;
            if (seaLevel) existingTrail.seaLevel = seaLevel;
            if (walkingTime) existingTrail.walkingTime = walkingTime;
            if (difficulty) existingTrail.difficulty = difficulty;

            if (location) {
                const locationExist = await Location.findById(location)
                if (locationExist) {
                    existingTrail.location = location
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
                existingTrail.sites = sites;

            }
            const updatedTrail = await existingTrail.save();

            return res.status(200).json(updatedTrail);

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    deleteTrail: async (req, res) => {
        const id = req.params.id

        try {

            const TrailFound = await Trail.findByIdAndDelete(id)
            if (TrailFound) {
                return res.status(200).json({ message: "Trail deleted successfully" })
            }
            else {
                return res.status(400).json({ message: "Trail Not Deleted" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    // getByFiler: async (req, res) => {
    //     const { location, difficulty, lengthInterval } = req.body
    //     let searchBy = {};
    //     if (location) {
    //         searchBy.location = location;
    //     }
    //     if (difficulty) {
    //         searchBy.difficulty = difficulty;
    //     }
    //     if (lengthInterval) {
    //         const [lowerBound, upperBound] = lengthInterval.split(',').map(Number);
    //         if (!isNaN(lowerBound) && !isNaN(upperBound)) {
    //             searchBy.length = { $gte: lowerBound, $lte: upperBound };
    //         } else {
    //             return res.status(400).json({ message: 'Invalid lengthInterval format' });
    //         }
    //     }

    //     try {

    //         const filteredTrails = await Trail.find(searchBy)
    //         if (filteredTrails) {
    //             return res.status(200).json(filteredTrails)
    //         }
    //     }
    //     catch (error) {
    //         return res.status(500).json({ message: error.message })
    //     }
    // }


}

export default trailController;