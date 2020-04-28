//***** Modules goes here *****//
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const express = require("express");
const Joi = require("joi");
const { UserData, generateAuthToken } = require("../../Models/user.model");
const { RoleData } = require("../../Models/role.model");
const { userroleData } = require("../../Models/userRole.model");
const { employeeData } = require('../../Models/employee.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.post("/", auth, async (req, res) => {
  const { error } = validateEmployeeData(req.body);
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
  req.body.userId = req.user._id;
  const role = await getRole(req.user._id);
  if (role.role[0] !== '4') {
    var err = {
      success: false,
      msg: "access denied"
    }
    res.status(403).send(err)
  }
  const profile = await createProfile(req.body)
  if(profile.success === false){
    res.status(400).send(profile)
    return
  }
  res.send(profile);
});
//***** ///// *****//

//***** User signup data validation function *****//
function validateEmployeeData(employeeData) {
  const schema = Joi.object().keys({
    services: Joi.array().items(
      Joi.object({
        serviceId: Joi.string().required(),
        charges: Joi.number().required()
      })
    ),
    weekPlans: Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().valid([1, 2, 3, 4, 5, 6, 7]).required(),
        availableStatus: Joi.number().valid([0, 1]).required(),
        checkIn: Joi.when('availableStatus', {
          is: 1, then: Joi.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/).required(), otherwise: Joi.optional()
        }),
        checkOut: Joi.when('availableStatus', {
          is: 1, then: Joi.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/).required(), otherwise: Joi.optional()
        })
      })
    )

  });
  return Joi.validate(employeeData, schema);
}
//***** ///// *****//

async function getRole(data) {
  const role = await userroleData.findOne({ userId: data });
  return role;
}


//***** Initialing and saving data *****//
async function createProfile(empData) {
  const employee = new employeeData(empData);
  var resResult;
  try {
    resResult = await employee.save();
  } catch (ex) {
    return {
      success: false,
      msg: "Error",
      data: ex
    };
  }
  return {
    success: true,
    msg: "Profile created successfully.",
    data: resResult
  };

}
//***** ///// *****//

module.exports = app;
