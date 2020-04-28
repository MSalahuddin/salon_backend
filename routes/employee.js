
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//



const signupModule = require('../controllers/employee/register');
app.use('/register', signupModule);

//~~ Login ~~//
const loginModule = require('../controllers/employee/login');
app.use('/login', loginModule);


const createProfile = require('../controllers/employee/createProfile');
app.use('/createProfile', createProfile);
//***** ///// *****//
module.exports = app;