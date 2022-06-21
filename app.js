import dotenv from 'dotenv';
import express from "express";
import fetch from "node-fetch";
import mongoose from 'mongoose';
import UserSchema from './schemas/User.js';
import EtagSchema from './schemas/Etag.js';

const app = express();
dotenv.config();

const response = await fetch("https://jsonkeeper.com/b/0RGY");
const etag = response.headers.get('etag');
const data = await response.json();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB.'))
.catch(err => console.log(err))

const User = mongoose.model('User', UserSchema)
const Etag = mongoose.model('Etag', EtagSchema)

// Check if this response is already the database and move ahead if it is not
app.use((req, res, next) => {
    Etag.findOne({
        etag: etag
    }, (error, response) => {
    if (error) {
        res.send(error);
    } else if (response) {
        res.send("Data with this ETag already exists.");
    } else {
        next();
    }
  })
})

app.post("/", (req, res) => {

    // Update data for a given document ID
    const updateData = (id,changedObject) => {
      User.findByIdAndUpdate({
        _id: id
      }, changedObject , (error, response) => {
        if (error) {
          console.log(error);
        } else if (response) {
          console.log("Values updated.");
        } else {
          console.log("Error updating value.");
        }
      })
    }

    // Check if collection needs to be updated for a given name or added with new PII data
    data.forEach(user => { 
      User.findOne({
        SSN: user.SSN,
      }, (error, response) => {
        if (error) {
          console.log(error);
        } else if (response) {
            let changedObject = {};
            for(const key in user){
                if(response[key] !== user[key]){
                    changedObject[key] = user[key];
                }
              }
            changedObject["_id"] = response["_id"];
            updateData(response._id,changedObject);
        } else {
          const newUser = new User({
            SSN: user.SSN,
            name: user.name,
            regex: user.regex,
            country: user.country,
            sector: user.sector,
            tag1: user.tag1,
            tag2: user.tag2,
            tag3: user.tag3,
          });
          newUser.save();
        }
      })
    })

    // Get all data from the collection and remove the ones not present in PII anymore
    User.find({}, (error, response) => {
      if (error) {
        console.log(error);
      } else if (response) {
        const ssnArray = [];

        data.forEach(user => {
          ssnArray.push(user.SSN);
        })

        response.forEach(user => {
          if (!ssnArray.includes(user.SSN)) user.remove();
        })
      } else {
        console.log("Error deleting values.");
      }
    })

    // Update Etag for the future so
    Etag.findByIdAndUpdate({
      _id: "62b0c422927a4502dc07003d"
      }, {
        etag: etag
      }, (error, response) => {
        if (error) {
          console.log(error);
        } else if (response) {
          res.send("ETag updated.");
        } else {
          res.send("Error updating ETag.");
        }
      })

    res.status(200);
    res.end(); 
})

app.listen(process.env.PORT, () => {
  console.log("Server started.");
});