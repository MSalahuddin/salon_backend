const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    min: 4,
    max: 30,
    required: true,
  },
  lastName: {
    type: String,
    max: 30,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNo: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    // select:false
  },
  Accounttype: {
    type: Number,
  },
  bio: {
    type: String,
    default: null,
  },

  dob: {
    type: Date,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  postalCode: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  province: { type: String, default: null },
  profile_img: { type: String },
  gcm_id: String,
  platform: String,
  createdDate: { type: Date, default: Date.now },
});
function generateAuthToken(_id) {
  const token = jwt.sign({ _id: _id }, config.get("jwtPrivateKey"));
  return token;
}
const UserData = mongoose.model("users", userSchema);

exports.UserData = UserData;
exports.generateAuthToken = generateAuthToken;
