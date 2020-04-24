//***** Modules goes here *****//
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const Joi = require('joi');
const { planItemData } = require('../../Models/plansItem.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.get('/', async(req, res)=> {
  const plans = await planItemData
  console.log(plans)
});
//***** ///// *****//

module.exports = app;