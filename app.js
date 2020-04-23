var createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
//***** ///// *****//
var app = express();

mongoose
  .connect(
    "mongodb+srv://sud:12345sud@cluster0-dhwk1.gcp.mongodb.net/test?retryWrites=true&w=majority"
  )
// mongoose.connect('mongodb://localhost/SaloonApp')
  .then(() => console.log("connected to Saloon APP..."))
  .catch((err) => console.errr("Could not connect to database...", err));
//***** ///// *****//

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public/images")));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use("/api", indexRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
