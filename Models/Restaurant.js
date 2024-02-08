import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Restaurant = new Schema({
    name:{
      type:String,
      required:true
    }
    ,
    description:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:true
    }
}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Restaurant", Restaurant);