const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  numberOfEmployer: {
    type: Number,
    required: false,
  },
  businessEmail: {
    type: String,
    unique: true,
    required: true,
  },
  businessTelephone: {
    type: Number,
    required: true,
    unique: true,
  },
  businessCertificate: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  postalCode: {
    type: Number,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  province: {
    type: String,
    default: null,
  },

  businessTaxId: {
    type: String,
    default: null,
  },
  isActive: {
    type: Number,
    default: 0,
  },
  createdDate: { type: Date, default: Date.now },
});
const companyData = mongoose.model("companies", companySchema);

exports.companyData = companyData;
