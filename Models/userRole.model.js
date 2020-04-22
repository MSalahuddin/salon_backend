
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userRoleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User'
    },
    role:{
        type:[String]
    },
});

const userroleData = mongoose.model('userRoles', userRoleSchema);


exports.userroleData = userroleData;