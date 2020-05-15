const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { socialLink } = require("../../Models/socialLink.model");
const express = require("express");
const auth = require("../../middleware/auth");

const app = express();

app.post("/", auth, async (req, res) => {
  //auth,
  const { error } = validateSocialLinkData(req.body);
  console.log(error);
  if (error) {
    var errors = {
      success: false,
      msg: error.name,
      data: error.details[0].message,
    };
    res.send(errors);
    return;
  }

  // req.body.companyId = req.user._id;
  const role = await getRole(req.user._id);

  if (role.role[0] !== "3") {
    var err = {
      success: false,
      msg: "access denied",
    };
    res.status(403).send(err);
  }

  const link = await createLink(req.body);
  if (link.success === false) {
    res.status(400).send(link);
    return;
  }
  res.send(link);
});

function validateSocialLinkData(linkData) {
  const schema = Joi.object().keys({
    companyId:Joi.string().required(),
    socialURL: Joi.array()
      .items(
        Joi.object({
          socialType: Joi.string().required(),
          url: Joi.string().required(),
        })
      )
      .required(),
  });
  return Joi.validate(linkData, schema);
}

async function getRole(data) {
  const role = await userroleData.findOne({ userId: data });
  return role;
}

async function createLink(data) {
  const link = new socialLink(data);
  var result;
  try {
    result = await link.save();
  } catch (err) {
    return { success: false, error: err, data: null };
  }
  return { success: true, data: result };
}

module.exports = app;
