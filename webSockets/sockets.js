const express = require("express");
var router = express.Router();
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);

  app.use("/",function(req, res, next){
    res.io.on("connection", function(client) {
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

  });
  module.exports = app;