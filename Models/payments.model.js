const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    }
});

const paymentMethods = mongoose.model('paymentMethods', paymentSchema);


exports.paymentMethods = paymentMethods;