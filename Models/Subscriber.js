import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Subscriber = new Schema({
    email:{
      type:String,
      required:true
    }
}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Subscriber", Subscriber);