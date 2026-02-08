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
  await Listing.deleteMany({});

  const newData = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("698707de56d24ca9a1f62fcb"),
  }));

  await Listing.insertMany(newData);

  console.log("New data added");
};

initDB();
