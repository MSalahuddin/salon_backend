var createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");
const indexRouter = require("./routes/index");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");

//***** ///// *****//
var app = express();
var io = require('socket.io')();
app.io = io;
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
app.use(cors());
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
app.io.on("connection", function(client) {
  console.log(client,'this is client')
  client.on("sign-in", e => {
    let user_id = e.id;
    if (!user_id) return;
    client.user_id = user_id;
    if (clients[user_id]) {
      clients[user_id].push(client);
    } else {
      clients[user_id] = [client];
    }
  });

  client.on("message", e => {
    let targetId = e.to;
    console.log(e)
    let sourceId = client.user_id;
    console.log(client.user_id,clients)
    cli.emit("message", e);
    if(targetId && clients[targetId]) {
      clients[targetId].forEach(cli => {
        console.log("asasas",cli)
        cli.emit("message", e);
      });
    }

    if(sourceId && clients[sourceId]) {
      clients[sourceId].forEach(cli => {
        console.log("asasas",cli)
        cli.emit("message", e);
      });
    }
  });

  client.on("disconnect", function() {
    if (!client.user_id || !clients[client.user_id]) {
      return;
    }
    let targetClients = clients[client.user_id];
    for (let i = 0; i < targetClients.length; ++i) {
      if (targetClients[i] == client) {
        targetClients.splice(i, 1);
      }
    }
  });
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
