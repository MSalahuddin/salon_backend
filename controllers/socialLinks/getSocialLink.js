const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { socialLink } = require("../../Models/socialLink.model");
const express = require("express");
const auth = require("../../middleware/auth");

const app = express();

app.get("/", auth, async (req, res) => {
  //auth,
  const role = await getRole(req.query.id);

  if (role.role[0] !== "3") {
    var err = {
      success: false,
      msg: "access denied",
    };
    res.status(403).send(err);
  }
  try {
      const link = await socialLink.findOne({companyId: req.query.id})
      res.send(link)
  } catch (error) {
      res.status(400).send()
  }
});

async function getRole(data) {
  const role = await userroleData.findOne({ userId: data });
  return role;
}

module.exports = app;
