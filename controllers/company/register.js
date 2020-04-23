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
    const validUser= await userValidation(req.body)
    const validCompany= await companyValidation(req.body)
  console.log(validUser)
  if(validUser.success ==false){
      res.send(validUser)
  }
  if(validCompany.success ==false){
    res.send(validCompany)
}
  const role = await getRole(req.body.user);

//   console.log(role)
//   const user = await createUser(req.body);
//   if (user == 500) {
//     var errors = {
//       success: false,
//       msg: "Duplicate",
//       data: "Email already exist",
//     };
//     res.send(errors);
//     return;
//   }

//   let data = _.pick(user, [
//     "_id",
//     "firstName",
//     "lastName",
//     "phoneNo",
//     "dob",
//     "email",
//     "createdDate",
//   ]);
//   const userRole = await createRole({ role: [role.type], userId: user._id });
//   if (userRole == 500) {
//     var errors = {
//       success: false,
//       msg: "Error in role",
//       data: "Role not created",
//     };
//     res.send(errors);
//     return;
//   }
//   data = { ...data, ...{ role: role.type } };
//   const requestData = {
//     success: true,
//     msg: "User created successfully.",
//     data: data,
//   };
//   res.send(requestData);
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
function validateCompanyData(companyData) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      size: Joi.number().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      phoneNo: Joi.number().required(),
      address: Joi.string().required(),
      postalCode: Joi.number().required(),
      city: Joi.string().required(),
      
    });
    return Joi.validate(companyData, schema);
  }
//***** ///// *****//

async function getRole(data) {
  const role = await RoleData.findOne({ type: data.role });
  return role;
}
async function createRole(data) {
  const role = new userroleData(data);
  try {
    const result = await role.save();
  } catch (err) {
    return 500;
  }
  return 200;
}

//***** Initialing and saving data *****//
// async function createUser(userData) {
//   delete userData.role;
//   userData.profile_img = "host/public/images/user.png";
//   userData.login_type = 0;
//   const user = new UserData(userData);
//   const salt = await bcrypt.genSalt(10);
//   const hashed = await bcrypt.hash(user.password, salt);
//   user.password = hashed;
//   var resResult;
//   try {
//     resResult = await user.save();
//   } catch (ex) {
//     console.log("catch");
//     console.log(ex.code);
//     return 500;
//   }
//   return resResult;
//   // });
// }
async function userValidation(Data){
    const { error } = validateUserData(Data.user);
    if (error) {
      var errors = {
        success: false,
        msg: `User ${error.name}`,
        data: error.details[0].message,
      };
      return errors;
    }
    return {success:true}
}
async function companyValidation(Data){
    const { error } = validateCompanyData(Data.company);
    if (error) {
      var errors = {
        success: false,
        msg: `Company ${error.name}`,
        data: error.details[0].message,
      };
      return errors;
    }
    return {success:true}
}
//***** ///// *****//

module.exports = app;
