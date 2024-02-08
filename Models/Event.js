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
    departureHr: {
        type: Number,
        required: true,
    },
    arrivalHr: {
        type: Number,
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
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            required: true,
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    }]

}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Event", Event);