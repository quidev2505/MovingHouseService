const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    status: {
        type: Boolean,
        default: true,
    },
    permission: {
        type: String,
        default: 'Nhân viên'
    },
    avatar: {
        type: String,
        default: null
    }

}, { timestamps: true })

module.exports = mongoose.model('Admin', userSchema);