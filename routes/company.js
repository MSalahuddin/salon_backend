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

//~~ Social Login ~~//
// const  SocialloginModule = require('../controllers/company/socialLogin');
// app.use('/social-login', SocialloginModule);
//***** ///// *****//

//~~ Edit Profile ~~//
// const editModule = require('../controllers/company/editProfile');
// app.use('/edit', editModule);
//***** ///// *****//

//***** ///// *****//
module.exports = app;