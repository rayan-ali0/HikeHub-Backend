import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Location = new Schema({
    name:{
      type:String,
      required:true
    }
}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Location", Location);