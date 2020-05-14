const express = require("express");
const app = express.Router();

const createLinkModule = require("../controllers/socialLinks/createLink");
app.use("/createLink", createLinkModule);

const getLinkModule = require("../controllers/socialLinks/getSocialLink");
app.use("/getLink", getLinkModule);

const updateLinkModule = require("../controllers/socialLinks/updateLink");
app.use("/updateLink", updateLinkModule);

module.exports = app;
