
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

const getEmployee = require('../controllers/employee/getEmployee');
app.use('/getEmployee', getEmployee);

const getMultipleEmployee = require('../controllers/employee/getMultipleEmployee');
app.use('/getMultipleEmployee', getMultipleEmployee);

const editEmployee = require('../controllers/employee/editEmployee');
app.use('/editEmployee', editEmployee);

const deleteEmployee = require('../controllers/employee/deleteEmployee');
app.use('/deleteEmployee', deleteEmployee);
module.exports = app;