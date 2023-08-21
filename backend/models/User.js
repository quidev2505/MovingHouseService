const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlngth: 6,
        maxlength: 20,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    full_name: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30,
    },
    phonenumber: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
    },
    address: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 50,
    },
    role:{
        type:String,
        default: 'user'
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);