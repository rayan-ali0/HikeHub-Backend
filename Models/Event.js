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
    maxSeats:{
        type: Number,
        required: true
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
        time: {
            type: String,
            required: false
        },

        users: [{
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            paid:{
                type:Boolean,
                default:false
            }
          
        }]
    }]
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