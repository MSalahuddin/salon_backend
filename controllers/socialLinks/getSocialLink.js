const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { socialLink } = require("../../Models/socialLink.model");
const express = require("express");
const auth = require("../../middleware/auth");

const app = express();

app.get("/", auth, async (req, res) => {
  //auth,
  const role = await getRole(req.user._id);
  if(!req.query.companyId){
    var err = {
      success: false,
      msg: "access denied",
    };
    res.status(403).send(err);
  }
  if (role.role[0] !== "3") {
    let err = {
      success: false,
      msg: "access denied",
    };
    res.status(403).send(err);
  }
  try {
      const link = await socialLink.findOne({companyId: req.query.companyId})
      var data = {
        success:true,
        msg:"link found",
        data:link
      }
      res.send(data)
  } catch (error) {
    let err = {
      success:false,
      msg:error,

    }
      res.status(400).send(err)
  }
});

async function getRole(data) {
  const role = await userroleData.findOne({ userId: data });
  return role;
}

module.exports = app;
