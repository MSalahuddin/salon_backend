//***** Modules goes here *****//
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const Joi = require('joi');
const { serviceData } = require('../../Models/service.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.post('/', async (req, res) => {
    let service = new serviceData(req.body);
    try {
        const result = await service.save();
        res.send(result)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }

});
//***** ///// *****//

module.exports = app;