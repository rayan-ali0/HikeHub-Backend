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
    images: [{
        type: String,
        required: true
    }],
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
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
    },
    sites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    }],
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    },
    slug:{
        type:String,
        required:true
    }

}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Trail", Trail);