import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Site = new Schema({
    name:{
      type:String,
      required:true
    }
    ,
    description:{
        type:String,
        required:true
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


export default mongoose.model("Site", Site);