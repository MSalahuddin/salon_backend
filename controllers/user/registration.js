//***** Modules goes here *****//
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('joi');
const { UserData, generateAuthToken } = require('../../Models/user.model');
const { RoleData } = require('../../Models/role.model');
const { userroleData } = require('../../Models/userRole.model')
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.post('/', async (req, res) => {
    const { error } = validateUserData(req.body);
    console.log(error)
    if (error) {
        var errors = {
            success: false,
            msg: error.name,
            data: error.details[0].message
        };
        res.send(errors);
        return;
    }
    const role = await getRole(req.body);
console.log(role._id)
    const user = await createUser(req.body)
    if (user == 500) {
        var errors = {
            success: false,
            msg: 'Duplicate',
            data: 'Email already exist'
        };
        res.send(errors);
        return;
    }

    let data = _.pick(user, ['_id', 'firstName', 'lastName', 'phoneNo', 'dob', 'email', 'createdDate'])
    const userRole = await createRole({role:[role.type],userId:user._id})
    if(userRole == 500){
        var errors = {
            success: false,
            msg: 'Error in role',
            data: 'Role not created'
        };
        res.send(errors);
        return;
    }
    data.role=req.body.role
    const requestData = {
        success: true,
        msg: 'User created successfully.',
        data: data
    }
    res.send(requestData);

    
});
//***** ///// *****//

//***** User signup data validation function *****//
function validateUserData(userData) {
    const schema = Joi.object().keys({
        firstName: Joi.string().min(4).max(30).required(),
        lastName: Joi.string().min(4).max(30).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        phoneNo: Joi.number().required(),
        password: Joi.string().min(5),
        gcm_id: Joi.string(),
        platform: Joi.string(),
        role: Joi.number().valid([1, 2, 3, 4, 5]).required()
    });
    return Joi.validate(userData, schema);
}
//***** ///// *****//

async function getRole(data) {
    // console.log(data)
    const role = await RoleData.findOne({ type: data.role });
    return role;
}
async function createRole(data) {
    console.log(data,"dddddddddddddddddddddd")
    const role = new userroleData(data);
    try {
        const result = await role.save();
    }
    catch (err) {
        return (500)
    }
    return (200)
}


//***** Initialing and saving data *****//
async function createUser(userData) {
    console.log(userData, "uper")
    delete userData.role;
    console.log(userData, "nechay")
    // return new Promise((res)=> {
    userData.profile_img = 'host/public/images/user.png';
    userData.login_type = 0;
    const user = new UserData(userData);
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);
    user.password = hashed;
    var resResult;
    try {
        resResult = await user.save();

    }
    catch (ex) {
        console.log('catch');
        console.log(ex.code);
        return (500);
    }
    return (resResult);
    // });
}
//***** ///// *****//

module.exports = app;