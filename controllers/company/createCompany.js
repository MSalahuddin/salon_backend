//***** Modules goes here *****//
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const express = require("express");
const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { companyData } = require('../../Models/company.model');
const auth = require('../../middleware/auth');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.post("/", auth, async (req, res) => {
    const { error } = validateCompanyData(req.body);
    console.log(error);
    if (error) {
        var errors = {
            success: false,
            msg: error.name,
            data: error.details[0].message,
        };
        res.send(errors);
        return;
    }
    req.body.userId = req.user._id;
    const role = await getRole(req.user._id);
    if (role.role[0] !== '3') {
        var err = {
            success: false,
            msg: "access denied"
        }
        res.status(403).send(err)
    }
    const company = await createCompany(req.body)
    if (company.success === false) {
        res.status(400).send(company)
        return
    }
    res.send(company);
});
//***** ///// *****//

//***** User signup data validation function *****//
function validateCompanyData(companyData) {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        numberOfEmployer: Joi.number().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        postalCode: Joi.number().required(),
        businessTaxId: Joi.string().required(),
        businessEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
        businessTelephone: Joi.number().required(),
        businessCertificate: Joi.string().required(),
    });
    return Joi.validate(companyData, schema);
}
//***** ///// *****//

async function getRole(data) {
    const role = await userroleData.findOne({ userId: data });
    return role;
}


//***** Initialing and saving data *****//
async function createCompany(data) {
    const company = new companyData(data)
    var result;
    try {
        result = await company.save();
    } catch (err) {
        return { success: false, error: err, data: null };
    }
    return { success: true, data: result };

}


//***** ///// *****//

module.exports = app;
