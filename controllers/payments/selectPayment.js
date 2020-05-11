//***** Modules goes here *****//
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const express = require("express");
const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { userPayment } = require('../../Models/userPayment.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.post("/", auth, async (req, res) => {
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const { error } = validatePaymentData(req.body);
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
    if (role.role[0] !== '3') {
        var err = {
            success: false,
            msg: "access denied"
        }
        res.status(403).send(err)
    }
    var paymentData = { ...req.body, ...{ userId: req.user._id } }
    const paymentMethod = await createUserPayment(paymentData)
    if (paymentMethod.success == false) {
      console.log(paymentMethod)
      res.send(paymentMethod)
      return
    }
    res.send(paymentMethod);
});
//***** ///// *****//

//***** User signup data validation function *****//
function validatePaymentData(paymentData) {
    const schema = Joi.object().keys({
      PaymentId: Joi.string().required(),
      cardNo: Joi.string().required(),
      cardOwnerName: Joi.string().required(),
    });
    return Joi.validate(paymentData, schema);
  }
//***** ///// *****//

async function getRole(data) {
    const role = await userroleData.findOne({ userId: data });
    return role;
}


//***** Initialing and saving data *****//
async function createUserPayment(data) {
    const payment = new userPayment(data);
    var result;
    try {
      result = await payment.save();
    } catch (err) {
      return { success: false, error: err, data: null };
    }
    return { success: true, data: result };
  
  }


//***** ///// *****//

module.exports = app;
