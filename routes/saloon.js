//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ get plans ~~//
const nearbySaloon = require('../controllers/saloon/nearbySaloon');
app.use('/Nearby', nearbySaloon);

// const setMethod = require('../controllers/payments/setpayment');
// app.use('/setMethod', setMethod);


// const selectMethod = require('../controllers/payments/selectPayment');
// app.use('/selectPayment', selectMethod);
//***** ///// *****//
module.exports = app;