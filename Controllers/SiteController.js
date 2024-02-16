import Site from "../Models/Site.js";

export const siteController = {
    addSite: async (req, res) => {
        const { name, description } = req.body
        const image= req.file.path

        try {
            if (!name || !description || !image ) {
                return res.status(400).json({ message: "Fields are required" })

            }
            const siteExist=await Site.findOne({name:name})
            if(siteExist){
                return res.status(400).json({ message: "This name already Exist" })

            }
            const site = await Site.create({ name, description, image })
            if (site) {
                return res.status(200).json(site)
            }
            else {
                return res.status(400).json({ message: "Error Creating the Site" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getSites: async (req, res) => {
        try {

            const Sites = await Site.find();
            if (Sites) {
                return res.status(200).json(Sites)
            }
            else {
                return res.status(400).json({ message: "No Sites Found" })

            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    getSite: async (req, res) => {
        const id = req.params.id
        try {
            const SiteFound = await Site.findById(id)
            if (SiteFound) {
                return res.status(200).json(SiteFound)
            }
            else {
                return res.status(400).json({ message: "Site Not Found" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    updateSite: async (req, res) => {
        const { id, name, description } = req.body
        const image = req.file.path;
        try {
            if (!id) {
                return res.status(400).json({ message: "You Should Provide The ID" })
            }
            const existingSite = await Site.findById(id);

            if (!existingSite) {
                return res.status(404).json({ message: "Site Doesn't Exist" });
            }
            if (name) existingSite.name = name;
            if (description) existingSite.description = description;
            if (image) existingSite.image = image;

            const updatedSite = await existingSite.save();

            return res.status(200).json(updatedSite);

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,
    deleteSite: async (req, res) => {
        const id = req.params.id

        try {

            const SiteFound = await Site.findByIdAndDelete(id)
            if (SiteFound) {
                return res.status(200).json({ message: "Site deleted successfully" })
            }
            else {
                return res.status(400).json({ message: "Site Not Deleted" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,


}

export default siteController;