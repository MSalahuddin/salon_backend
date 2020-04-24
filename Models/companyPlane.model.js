const mongoose = require("mongoose");

const companyPlanSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "companies",
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "planItems",
  },
  price: {
    type: Number,
  },
  qty: {
    type: Number,
  },
});

const companyPlanData = mongoose.model("companyPlan", companyPlanSchema);

exports.companyPlanData = companyPlanData;
