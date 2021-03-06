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
const distance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    // if (d>1) 
    return Math.round(d);
    // else if (d<=1) return Math.round(d*1000)+"m";
    // return d;
  }
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
    if (role.role[0] === '3' ) {
        var err = {
            success: false,
            msg: "access denied"
        }
        res.status(403).send(err)
    }
    const saloon = await getSaloon(req.body)
   res.send(saloon)
});
//***** ///// *****//

//***** User signup data validation function *****//
function validateCompanyData(companyData) {
    const schema = Joi.object().keys({
        latitude:Joi.number().required(),
        longitude:Joi.number().required(),
        radius:Joi.number().required()
    });
    return Joi.validate(companyData, schema);
}
//***** ///// *****//

async function getRole(data) {
    const role = await userroleData.findOne({ userId: data });
    return role;
}


//***** Initialing and saving data *****//
async function getSaloon(loc) {
    const saloon = await companyData.find();
    let nearBy = [];
    saloon.map((data,index)=>{
     const dis =  distance(loc.latitude,loc.longitude,data.latitude,data.longitude)
     console.log(dis,loc.radius)
        if(dis  <= loc.radius){
        nearBy.push(data)
        }
    })
    return {success:true,msg:"data found",data:nearBy}
}


//***** ///// *****//

module.exports = app;
