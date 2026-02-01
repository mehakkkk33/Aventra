const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wandernest";

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// MIDDLEWARE (IMPORTANT ORDER)
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized :true
};

app.use(session(sessionOptions));


// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong!" : err.message;
  res.status(statusCode).render("error", { statusCode, message });
});


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
