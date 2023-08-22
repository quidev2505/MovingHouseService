const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    phonenumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 11,
    },
    password:{
        type:String,
        required:true,
        minlength: 8,
    },
    role:{
        type:String,
        default: 'user'
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);