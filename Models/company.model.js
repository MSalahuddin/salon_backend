
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'User'
    },
    companyName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: false
    },
    businessEmail: {
        type: String,
        unique: true,
        required: true
    },
    phoneNo: {
        type: Number,
        unique: true
    },
    address: {
        type: String,
        default: null
    },
    postalCode: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null
    },
    province: {
        type: String,
        default: null
    },

    Business_id: {
        type: String,
        default: null
    },
    Active:{
        type:Number,
        default:0
    },
    createdDate: { type: Date, default: Date.now },
});
function generateAuthToken(_id) {
    const token = jwt.sign({ _id: _id }, config.get('jwtPrivateKey'));
    return token;
}
const UserData = mongoose.model('users', userSchema);


exports.UserData = UserData;
exports.generateAuthToken = generateAuthToken;