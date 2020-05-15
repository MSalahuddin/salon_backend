const express = require("express");
const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { employeeData } = require('../../Models/employee.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.patch("/", auth, async (req, res) => {
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
  try {
      const updateKeys = Object.keys(req.body)
      updateKeys.forEach(update => req.user[update] = req.body[update])
      await req.user.save()
      res.send(req.user)
  } catch (error) {
      res.status(400).send()
  }

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

module.exports = app;
