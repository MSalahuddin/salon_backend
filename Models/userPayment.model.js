const mongoose = require('mongoose');


const userPaymentSchema = new mongoose.Schema({
    PaymentId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'paymentMethods'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User'
    },
    cardNo:{
        type:String
    },
    expiry:{
        type:Date
    },
    cardHolderName:{
        type:String,
    },
    createdDate:{ type:Date, default:Date.now },
});

const userPayment = mongoose.model('userPayment', userPaymentSchema);


exports.userPayment = userPayment