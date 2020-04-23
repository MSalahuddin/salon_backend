
const mongoose = require('mongoose');


const CompanyPlanSchema = new mongoose.Schema({
    CompanyId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'companies'
    },
    planId:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'planItems'
    },
    price:{
        type:Number,

    },
    Qty:{
        type:Number
    },
});

const planItemData = mongoose.model('planItems', planItemsSchema);


exports.planItemData = planItemData;