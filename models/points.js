import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {type:String , require: true},
    points:{type:Number,default:0},
})

export default mongoose.model("User",userSchema)