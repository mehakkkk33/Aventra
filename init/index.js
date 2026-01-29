const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wandernest";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

main().catch(err => console.log(err));

const initDB = async () => {
  // DELETE OLD DATA FROM DATABASE
  await Listing.deleteMany({});  
  console.log("Old data removed");

  // INSERT NEW DATA FROM data.js
  await Listing.insertMany(initData.data);
  console.log("New data added");
};

initDB();
