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
  const validUser = await userValidation(req.body);
  const validCompany = await companyValidation(req.body);
  const validPlan = await planValidation(req.body);
  const validPayment = await paymentValidation(req.body);

  // validation error response send
  if (validUser.success == false) {
    res.send(validUser);
  }
  if (validCompany.success == false) {
    res.send(validCompany);
  }
  if (validPlan.success == false) {
    res.send(validPlan);
  }

  if (validPayment.success == false) {
    res.send(validPayment);
  }
  /////////////////////////////////////

  ////////////// get role and validate to client /////////////////////

  const roleResponse = await getRole(req.body.user);

  if (roleResponse.type != 3) {
    res.send({
      success: false,
      msg: "You don't have enough rights to access this service",
    });
  }

  ////////////// create user ///////////////////////

  const user = await createUser(req.body.user);

  if (!user.success) {
    res.send(user);
  }

  //////////// create user role /////////////////
  const userRole = await createRole({
    role: [roleResponse.type],
    userId: user.data._id,
  });
  if (userRole == 500) {
    var errors = {
      success: false,
      msg: "Error in role",
      data: "Role not created",
    };
    res.send(errors);
    return;
  }
  console.log(userRole, "rolllllllllllllllll");

  //   let data = _.pick(user, [
  //     "_id",
  //     "firstName",
  //     "lastName",
  //     "phoneNo",
  //     "dob",
  //     "email",
  //     "createdDate",
  //   ]);
  //
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
    password: Joi.string().min(5).required(),
    gcm_id: Joi.string(),
    address: Joi.string().required(),
    postalCode: Joi.string(),
    dob: Joi.date(),
    city: Joi.string(),
    province: Joi.string(),
    platform: Joi.string(),
    role: Joi.number().valid([1, 2, 3, 4, 5]).required(),
  });
  return Joi.validate(userData, schema);
}
//***************** validation for company Data */
function validateCompanyData(companyData) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    numberOfEmployer: Joi.number().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    province: Joi.string().required(),
    postalCode: Joi.number().required(),
    businessTaxId: Joi.string().required(),
    businessEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
    businessTelephone: Joi.number().required(),
    businessCertificate: Joi.string().required(),
  });
  return Joi.validate(companyData, schema);
}
//***** ///// *****//

//**validata paymentMethod Data */

function validatePaymentData(paymentData) {
  const schema = Joi.object().keys({
    paymentMethodId: Joi.string().required(),
    cardNo: Joi.string().required(),
    cardOwnerName: Joi.string().required(),
  });
  return Joi.validate(paymentData, schema);
}
//***////// */

//**validate plan */
function validatePlanData(plandata) {
  const schema = Joi.object().keys({
    planItems: Joi.array()
      .items(
        Joi.object({
          itemId: Joi.string().required(),
          price: Joi.number().required(),
          qty: Joi.number().required(),
        })
      )
      .required(),
  });
  return Joi.validate(plandata, schema);
}
//**///////// */

//**validate planItems */
function validatePlanItemData(plandata) {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    qty: Joi.number().required(),
  });
  return Joi.validate(plandata, schema);
}
//**///////// */

//****get Role from Database */
async function getRole(data) {
  const roles = await RoleData.findOne({ type: data.role });
  // console.log(roles.role, "rrrrrrrrrrrr///////////");
  // if (roles.role == "client") {
  //   response = { success: true, data: roles };
  // } else {
  //   response = {
  //     success: false,
  //     msg: "You don't have enough rights to access this service",
  //   };
  // }
  return roles;
}
//*****//////// *//

//**Create Role *//
async function createRole(data) {
  const role = new userroleData(data);
  try {
    const result = await role.save();
  } catch (err) {
    return 500;
  }
  return 200;
}
//***///// *//

//***** Initialing and saving data *****//
async function createUser(userData) {
  delete userData.role;
  userData.profile_img =
    "https://easy-1-jq7udywfca-uc.a.run.app/public/images/user.png";
  userData.login_type = 0;
  const user = new UserData(userData);
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(user.password, salt);
  user.password = hashed;
  var resResult;
  try {
    resResult = await user.save();
  } catch (err) {
    return { success: false, error: err, data: null };
  }
  return { success: true, data: resResult };
}

//****validation Functions */
async function userValidation(data) {
  //user validation
  const { error } = validateUserData(data.user);
  if (error) {
    var errors = {
      success: false,
      msg: `User ${error.name}`,
      data: error.details[0].message,
    };
    return errors;
  }
  return { success: true };
}

async function companyValidation(data) {
  //company validation
  const { error } = validateCompanyData(data.company);
  if (error) {
    var errors = {
      success: false,
      msg: `Company ${error.name}`,
      data: error.details[0].message,
    };
    return errors;
  }
  return { success: true };
}

async function paymentValidation(data) {
  //payment validation
  const { error } = validatePaymentData(data.payment);
  if (error) {
    var errors = {
      success: false,
      msg: `Payment ${error.name}`,
      data: error.details[0].message,
    };
    return errors;
  }
  return { success: true };
}

async function planValidation(data) {
  //plan validation
  const { error } = validatePlanData(data.plan);
  if (error) {
    var errors = {
      success: false,
      msg: `Plans ${error.name}`,
      data: error.details[0].message,
    };
    return errors;
  }
  // if(data.plan && data.plan.planItems){
  //     for (var i = 0 ;i < data.plan.planItems.length; i++){
  //         let validItems = await planItemValidation(data.plan.planItems[i])
  //         if(validItems.success ===false){
  //             return validItems
  //         }
  //     }
  //     return {success:true}
  // }
  // else{
  //     var err = {
  //         success: false,
  //         msg: `Plans planValidation Error`,
  //         data: 'provide a Valid Plan',
  //     }
  //     return err
  // }

  return { success: true };
}

async function planItemValidation(Data) {
  //plan validation

  const { error } = validatePlanItemData(Data);
  if (error) {
    var errors = {
      success: false,
      msg: `Plans ${error.name}`,
      data: error.details[0].message,
    };
    return errors;
  }
  return { success: true };
}

//***** ///// *****//

module.exports = app;
