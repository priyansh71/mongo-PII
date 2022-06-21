import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    SSN : Number,
    name : String,
    regex: String,
    country : String,
    sector : String,
    tag1: String,
    tag2: String,
    tag3: String,
}, {timestamps: true});
  
export default UserSchema;