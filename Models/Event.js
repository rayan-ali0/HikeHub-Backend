import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Event = new Schema({
    trail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trail',
    },
    date: {
        type: Date,
        required: true,
    },
    arrivalHr: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['ongoing', 'postponed'],
        default: 'ongoing'
    },
    restaurants: {
        breakfast: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
        },
        lunch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
        },
    },
    tools: [{
        type: String,
        required: false
    }]
    ,

    meetingPoints: [{
        meetingPoint: {
            type: String,
            required: true
        },
        // location: {
        //     type: String,
        //     required: true
        // },
        time: {
            type: String,
            required: false
        },

        users: [{
            type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
        }]
    }]
    // meeting_points[]= [{"meeting_point":"location","users":[]},{"meeting_point":"location",time:"8:00",users":[]
    ,
    slug: {
        type: String,
        required: true,
        unique: true
    }

}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Event", Event);