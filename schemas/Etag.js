import mongoose from "mongoose";

const EtagSchema = new mongoose.Schema({
    etag : String,
}, {timestamps: true});
  
export default EtagSchema;