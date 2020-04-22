//***** Modules goes here *****//
var _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const Joi = require("joi");
const { UserData, generateAuthToken } = require("../../Models/user.model");
const { userroleData } = require("../../Models/userRole.model");
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.post("/", async (req, res) => {
  console.log(req.body);
  const url = req.protocol + "://" + req.get("host");
  const { error } = validateUserData(req.body);
  if (error) {
    var errors = {
      success: false,
      msg: error.name,
      data: error.details[0].message,
    };
    res.send(errors);
    return;
  }
  const user = await checkUser(req.body);
  if (user == null) {
    var errors = {
      success: false,
      msg: "Invalid email or password.",
      data: "",
    };
    res.send(errors);
  }
  const role = await getUserRole(user._id);
  var data = _.pick(user, [
    "_id",
    "firstName",
    "lastName",
    "phoneNo",
    "email",
    "profile_img",
    "createdDate",
    "access_token",
  ]);
  data = { ...data, ...{ role: role.role[0] } };
  console.log(data);
  data.profile_img = `${url}${data.profile_img}`;
  var success = {
    success: true,
    msg: "User Found",
    data: data,
  };
  res.send(success);
});
//***** ///// *****//

//***** User login data validation function *****//
function validateUserData(userData) {
  const schema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(5),
    gcm_id: Joi.string(),
    platform: Joi.string(),
  });
  return Joi.validate(userData, schema);
}
//***** ///// *****//
async function getUserRole(data) {
  const role = await userroleData.findOne({ userId: data });
  return role;
}
async function checkUser(body) {
  const user = await UserData.findOne({ email: body.email });
  if (!user) return null;

  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) return null;

  user.access_token = generateAuthToken(user._id);

  if (user) {
    const result = await UserData.updateOne(
      { _id: user._id },
      {
        $set: {
          gcm_id: body.gcm_id,
          platform: body.platform,
        },
      }
    );
  }

  return user;
}

module.exports = app;
