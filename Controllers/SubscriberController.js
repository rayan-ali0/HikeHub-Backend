import Subscriber from '../Models/Subscriber.js'


export const SubscriberController = {
    addSubscriber: async (req, res) => {
        const { email } = req.body
        try {

            const emailFound = await Subscriber.findOne({email:email})
            if (emailFound) {
                return res.status(400).json({ message: "You Have Already Subscribed From This Email!" })
                
            }
            const subscriber = await Subscriber.create({email:email})

            if (subscriber) {
                return res.status(200).json({ message: "You Have Subscribed Successfully" , data : subscriber })
            }
            else {  
                return res.status(400).json({ message: "Error Creating Subscription" })

            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    ,

    getSubscribers: async (req, res) => {
        try {

            const Subscribers = await Subscriber.find()
            if (Subscribers) {
                return res.status(200).json(Subscribers)
            }
            else {
                return res.status(400).json({ message: "No Subscribers Found" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteSubscribe: async (req, res) => {
        const {id}=req.params
        try {

            const Subscribers = await Subscriber.findByIdAndDelete(id)
            if (Subscribers) {
                return res.status(200).json(Subscribers)
            }
            else {
                return res.status(400).json({ message: "No Subscribers Found" })
            }

        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export default SubscriberController;