//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ get plans ~~//
const getPost = require('../controllers/posting/getPost');
app.use('/getpost', getPost);

const uploadPost = require('../controllers/posting/uploadPost');
app.use('/upload', uploadPost);
//***** ///// *****//
module.exports = app;