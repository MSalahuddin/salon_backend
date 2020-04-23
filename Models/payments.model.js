const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
});

const paymentMethods = mongoose.model('paymentMethods', paymentSchema);


exports.paymentMethods = paymentMethods;