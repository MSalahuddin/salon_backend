//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ get plans ~~//
const getService = require('../controllers/services/getService');
app.use('/getService', getService);

const createService = require('../controllers/services/createService');
app.use('/createservice', createService);
//***** ///// *****//
module.exports = app;