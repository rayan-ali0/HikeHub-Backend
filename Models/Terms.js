import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Terms = new Schema({
    values:[{
      type:String,
      required:true
    }]
}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Terms", Terms);