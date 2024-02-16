import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Story = new Schema({
    title:{
      type:String,
      required:true
    }
    ,
    description:{
        type:String,
        required:false
    },
    images:[{
        type:String,
        required:true
    }]
    ,
    date:{
        type:Date,
        required:false
    }
}
    ,
    {
        timestamps: true
    });


export default mongoose.model("Story", Story);