import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Trail = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    seaLevel: {
        type: Number,
        required: true,
    },
    walkingTime: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
    },
    sites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    }],
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    },

}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Trail", Trail);