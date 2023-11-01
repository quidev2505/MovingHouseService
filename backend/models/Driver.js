const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
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
    vehicle_type: {
        type: String,
        required: true
    },
    //Biển số xe
    license_plate: {
        type: String,
        required: true
    },
    location_delivery: {
        type: String,
        required: true
    },//Khu vực giao hàng
    avatar: {
        type: String,
        required: true
    },//Ảnh đại diện người dùng
    id_rating: {
        type: Array, of: Object, default: []
    },//Mảng lịch sử đánh giá của tài xế
    id_delivery: {
        type: Array, of: Object, default: []
    },//Mảng danh sách giao hàng của tài xế
    star_average: {
        type: Number,
        default: 0
    },//Số sao trung bình của tài xế
    status: {
        type: String,
        default: "Sẵn sàng"
    },//Gồm 2 trạng thái: Đang Bận, Sẵn Sàng,
    current_position: {
        type: String,
        default: null
    }//Vị trí hiện tại của tài xế
}, { timestamps: true })

module.exports = mongoose.model('Driver', driverSchema);