const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    customer_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    created_date: {
        type: String,
        required:true
    },
    service_name: {
        type:String,
        required: true
    },
    moving_date: {
        type:String,
        required: true 
    },//Dạng ngày + giờ Ví dụ: 21:47
// 27 tháng 8 năm 202
    distance: {
        type: String,
        requierd: true
    },
    fromLocation: {
        type:String,
        required: true
    }, //Dạng: địa chỉ - địa chỉ cụ thể
    toLocation: {
        type: String,
        required: true
    }, //Dạng: địa chỉ - địa chỉ cụ thể
    vehicle_price:{
        type: Number,
        required:true
    },
    vehicle_name: {
        type:String,
        required:true
    },
    driver_id:{
        type: mongoose.Types.ObjectId,
        ref: 'Driver',
        default: null
    },
    man_power_quantity: {
        type:Number,
        required:true
    },
    man_power_price:{
        type:Number,
        required:true
    },
    moving_fee:{
        type: Array, of: String, default: []
    },
    service_fee:{
        type: Array, of: String, default: []
    },
    noteDriver:{
        type: String,
        requied: true
    },
    item_detail:{
        type: Array, of: String, default: []
    },
    totalOrder:{
        type:Number,
        requierd:true
    },
    status:{
        type:String,
        default: "Đang tìm tài xế"
    }

}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);