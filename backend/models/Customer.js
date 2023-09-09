const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30,
    },
    address: {
        type: String,
        default:null
    },
    avatar: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        default:null
    },
}, { timestamps: true })

module.exports = mongoose.model('Customer', customerSchema);