//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ Signup ~~//
const signupModule = require('../controllers/company/register');
app.use('/register', signupModule);

//~~ Login ~~//
const loginModule = require('../controllers/company/login');
app.use('/login', loginModule);
//***** ///// *****//

//~~ create company ~~//
const  createCompany= require('../controllers/company/createCompany');
app.use('/createCompany', createCompany);
//***** ///// *****//
const getCompany = require('../controllers/company/getCompany');
app.use('/getCompany:id', getCompany);
//~~ create plans ~~//
const createPlans = require('../controllers/company/createPlan');
app.use('/plan', createPlans);
//***** ///// *****//

//***** ///// *****//
module.exports = app;