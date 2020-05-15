const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { socialLink } = require("../../Models/socialLink.model");
const express = require("express");
const auth = require("../../middleware/auth");

const app = express();

app.put("/", auth, async (req, res) => {
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

  const role = await getRole(req.user._id);

  if (role.role[0] !== "3") {
    let err = {
      success: false,
      msg: "access denied",
    };
    res.status(403).send(err);
  }

  try {
    const updateKeys = Object.keys(req.body)
    const link = await socialLink.findOne({companyId: req.query.companyId})
    updateKeys.forEach(update => link[update] = req.body[update])
    await link.save()
    var data ={
      success:true,
      msg:"updated",
      data:link
    }
    res.send(data)
  } catch (error) {
    let err = {
      success:false,
      msg:error
    }
    res.status(400).send(err)
  }
});

function validateSocialLinkData(linkData) {
  const schema = Joi.object().keys({
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

module.exports = app;
