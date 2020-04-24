
const mongoose = require('mongoose');


const planItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    createdDate:{ type:Date, default:Date.now },
});

const planItemData = mongoose.model('planItems', planItemsSchema);


exports.planItemData = planItemData;