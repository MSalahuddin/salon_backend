const mongoose = require("mongoose");


const serviceSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  createdDate: { type: Date, default: Date.now },
});
const serviceData = mongoose.model("services", serviceSchema);

exports.serviceData = serviceData;
