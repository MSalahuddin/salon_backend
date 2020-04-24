//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ get plans ~~//
const getMethod = require('../controllers/payments/getpayment');
app.use('/getMethod', getMethod);

// const setMethod = require('../controllers/payments/setpayment');
// app.use('/setMethod', setMethod);
//***** ///// *****//
module.exports = app;