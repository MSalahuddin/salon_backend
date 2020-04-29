//***** Modules goes here *****//
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const express = require("express");
const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { companyPlanData } = require('../../Models/companyPlane.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.post("/", auth, async (req, res) => {
    const { error } = validatePlanData(req.body);
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
    if (role.role[0] !== '3') {
        var err = {
            success: false,
            msg: "access denied"
        }
        res.status(403).send(err)
    }

    const plan = await arrayOfPlan(req.body.planItems,req.body.companyId)
    if (plan.success === false) {
        res.status(400).send(plan)
        return
    }
    res.send(plan);
});
//***** ///// *****//

//***** User signup data validation function *****//
function validatePlanData(plandata) {
    const schema = Joi.object().keys({
    companyId:Joi.string().required(),
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
//***** ///// *****//

async function getRole(data) {
    const role = await userroleData.findOne({ userId: data });
    return role;
}


//***** Initialing and saving data *****//
async function createCompanyPlan(data) {
    console.log(data)
    const companyPlan = new companyPlanData(data);
    var result;
    try {
      result = await companyPlan.save();
    } catch (err) {
      console.log(err)
      return { success: false, error: err, data: null };
    }
    return { success: true, data: result };
  
  }
  
  
  async function arrayOfPlan(data, companyId) {
    for (var i = 0; i < data.length; i++) {
      var planData = { ...data[i], ...{ companyId: companyId } }
      const plan = await createCompanyPlan(planData);
      if (plan.success == false) {
        return plan;
      }
    }
    return { success: true, msg: "Plan Created" }
  }


//***** ///// *****//

module.exports = app;
