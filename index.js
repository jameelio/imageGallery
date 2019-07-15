require('dotenv').config();
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./routes/users");
const mongoDB = require("./database");
const app = express();

var jwt = require("jsonwebtoken");

const dbURI = process.env.DB;
mongoDB.connectDB(dbURI);

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set("secretKey", process.env.SECRETS);

app.get("/favicon.ico", function(req, res) {
  res.sendStatus(204);
});

// public route
app.use('/', users);

app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// app.use(function(err, req, res, next) {
//   if (err.status === 404) res.status(404).json({ message: "Route does not exist" });
//   else res.status(500).json({ message: "OOPS!! Something went wrong"});
// });

app.listen(8000, function() {
  console.log("Listening on port 8000");
});
