import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'organizer'],
        default: 'user'
    },
    phone:{
        type: Number,
        required: true,
    }
}
,
{
    timestamps:true
});


export default mongoose.model("User", User);