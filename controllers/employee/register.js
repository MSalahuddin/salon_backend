//***** Modules goes here *****//
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const express = require("express");
const Joi = require("joi");
const { UserData, generateAuthToken } = require("../../Models/user.model");
const { RoleData } = require("../../Models/role.model");
const { userroleData } = require("../../Models/userRole.model");
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.post("/", async (req, res) => {
  const { error } = validateUserData(req.body);
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
  const role = await getRole(req.body);
  if(role.role == "employee"){
    var err = {
      success:false,
      msg:"you have no access to use this service",
      data : null
    }
    res.send(err);
    return;
  }
  console.log(role)
  const user = await createUser(req.body);
  if (user == 500) {
    var errors = {
      success: false,
      msg: "Duplicate",
      data: "Email already exist",
    };
    res.send(errors);
    return;
  }

  let data = _.pick(user, [
    "_id",
    "firstName",
    "lastName",
    "phoneNo",
    "dob",
    "email",
    "createdDate",
    "access_token"
  ]);
 
  const userRole = await createRole({ role: [role.type], userId: user._id });
  if (userRole.success == false) {
   
    res.send(userRole);
    return;
  }
  data = { ...data, ...{ role: role.type } };
  const requestData = {
    success: true,
    msg: "User created successfully.",
    data: data,
  };
  res.send(requestData);
});
//***** ///// *****//

//***** User signup data validation function *****//
function validateUserData(userData) {
  const schema = Joi.object().keys({
    firstName: Joi.string().min(4).max(30).required(),
    lastName: Joi.string().min(4).max(30).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    phoneNo: Joi.number().required(),
    password: Joi.string().min(5),
    gcm_id: Joi.string(),
    address: Joi,
    postalCode: Joi,
    dob: Joi,
    city: Joi,
    platform: Joi.string(),

    role: Joi.number().valid([1, 2, 3, 4, 5]).required(),
  });
  return Joi.validate(userData, schema);
}
//***** ///// *****//

async function getRole(data) {
  const role = await RoleData.findOne({ type: data.role });
  return role;
}
async function createRole(data) {
  const role = new userroleData(data);
  var result;
  try {
    result = await role.save();
  } catch (err) {
    return {success:false,error:err};
  }
  return {success:true,data:result};
}

//***** Initialing and saving data *****//
async function createUser(userData) {
  delete userData.role;
  userData.profile_img = "https://easy-1-jq7udywfca-uc.a.run.app/public/images/user.png";
  userData.login_type = 0;
  const user = new UserData(userData);
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(user.password, salt);
  user.password = hashed;
  user.access_token = generateAuthToken;
  var resResult;
  try {
    resResult = await user.save();
  } catch (ex) {
    console.log("catch");
    console.log(ex.code);
    return 500;
  }
  return resResult;
  // });
}
//***** ///// *****//

module.exports = app;
