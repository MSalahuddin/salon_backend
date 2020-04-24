//***** Modules goes here *****//
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const Joi = require('joi');
const { paymentMethods } = require('../../Models/payments.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.get('/', async(req, res)=> {
    try{
  const plans = await paymentMethods.find();
  res.send({success:true,msg:"plans Found",data:plans})
}
catch(err){
    res.send({success:false,msg:"Error",data:''})
}

});
//***** ///// *****//

module.exports = app;