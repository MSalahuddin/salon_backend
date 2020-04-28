const mongoose = require("mongoose");


const EmployeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique:true,
    ref: "User",
  },

  services: {
    type:[Object],
  },
  weekPlans: {
    type:[Object],
  },
  createdDate: { type: Date, default: Date.now },
});
const employeeData = mongoose.model("employee", EmployeeSchema);

exports.employeeData = employeeData;
