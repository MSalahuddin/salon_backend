const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    to: [{
        receivers: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true
        }
    }],
    message: {
        type: String,
        default: 'Hey!'
    },
    createdDate: { 
        type: Date, 
        default: Date.now
     }
})

const messages = mongoose.model('messages', messagesSchema)

exports.messages = messages