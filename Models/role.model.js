
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const roleSchema = new mongoose.Schema({
    type: {
        type: String
    },
    name:{
        type:String
    },
});

const RoleData = mongoose.model('roles', roleSchema);


exports.RoleData = RoleData;