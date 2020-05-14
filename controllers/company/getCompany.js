//***** Modules goes here *****//
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const Joi = require('joi');
const { userroleData } = require("../../Models/userRole.model");
const { companyData } = require('../../Models/company.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Login *****//
app.get('/', auth, async (req, res) => {
    const role = await getRole(req.user._id);
    if (role.role[0] !== '3') {
        var err = {
            success: false,
            msg: "access denied"
        }
        res.status(403).send(err)
    }
    try {
        // const company = await companyData.findOne({userId: req.params.id})
        const company = await companyData.findOne({ userId: req.user._id })
        var response = {
            success: true,
            msg: "company found",
            data:company
        }
        res.send(response)
    } catch (error) {
        var result = {
            success: false,
            msg: error,
            
        }
        res.status(400).send(result)
    }

});

async function getRole(data) {
    const role = await userroleData.findOne({ userId: data });
    return role;
}

module.exports = app;