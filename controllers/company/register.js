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
    const validUser= await userValidation(req.body);
    const validCompany= await companyValidation(req.body);
    const validPlan = await planValidation(req.body);
    const validPayment = await paymentValidation(req.body);
  console.log(validUser)
  if(validUser.success ==false){
      res.send(validUser)
  }
  if(validCompany.success ==false){
    res.send(validCompany)
}
if(validPlan.success == false){
    res.send(validPlan)
}

if(validPayment.success == false){
    res.send(validPayment)
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
//***************** validation for company Data */
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

//**validata paymentMethod Data */

function validatePaymentData(paymentData) {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
});
    return Joi.validate(paymentData, schema);
  }
//***////// */


//**validate plan */
function validatePlanData(plandata){
    const schema = Joi.object().keys({
        planItems: Joi.array().items(Joi.object({
            id: Joi.string().required(),
            qty:Joi.number().required()  
        })).required(),
  });
      return Joi.validate(plandata, schema);
}
//**///////// */



//**validate planItems */
function validatePlanItemData(plandata){
    const schema = Joi.object().keys({
        id: Joi.string().required(),
        qty:Joi.number().required()
  });
      return Joi.validate(plandata, schema);
}
//**///////// */

//****get Role from Database */
async function getRole(data) {
  const role = await RoleData.findOne({ type: data.role });
  return role;
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
  userData.profile_img = "https://easy-1-jq7udywfca-uc.a.run.app/public/images/user.png";
  userData.login_type = 0;
  const user = new UserData(userData);
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(user.password, salt);
  user.password = hashed;
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



//****validation Functions */
async function userValidation(Data){                                            //user validation
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






async function companyValidation(Data){                             //company validation
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





async function paymentValidation(Data){                             //payment validation
    const { error } = validatePaymentData(Data.payment);
    if (error) {
      var errors = {
        success: false,
        msg: `Payment ${error.name}`,
        data: error.details[0].message,
      };
      return errors;
    }
    return {success:true}
}




async function planValidation(Data){                             //plan validation
    const { error } = validatePlanData(Data.plan);
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

    return {success:true}
}



async function planItemValidation(Data){                         //plan validation



    const { error } = validatePlanItemData(Data);
    if (error) {
      var errors = {
        success: false,
        msg: `Plans ${error.name}`,
        data: error.details[0].message,
      };
      return errors;
    }
    return {success:true}
}

//***** ///// *****//

module.exports = app;
