//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ get plans ~~//
const getPlan = require('../controllers/plan/getPlan');
app.use('/getplan', getPlan);


//***** ///// *****//
module.exports = app;