const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    profile_code: {
        type: String,
        required: true
    },//Mã hồ sơ
    username: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },//Nam, Nữ, Khác
    citizen_id: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },//Địa chỉ thường trú
    avatar: {
        type: String,
        required: true
    },//Ảnh đại diện người dùng
    status: {
        type: String,
        default: "Sẵn sàng"
    },//Gồm 2 trạng thái: Hoạt động, tạm ngưng
    department: {
        type: String,
        required: true
    }//Bộ phận trong công ty
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema);