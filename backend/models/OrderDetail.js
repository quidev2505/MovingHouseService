const mongoose = require('mongoose')

const orderDetailSchema = new mongoose.Schema({
    distance: {
        type: Number,
        required:true
    },
    fromLocation_detail:{
        type: String,
        required: true
    },
    toLocation_detail:{
        type:String,
        required: true
    },
    man_power_quantity: {
        type:Number,
        required:true
    },
    man_power_price:{
        type:Number,
        required: true
    },
    moving_fee: {
        type: Array, of: String, default: []
    },
    service_fee:{
        type: Array, of: String, default: []
    },
    noteDriver: {
        type: String,
        required: true
    },
    item_detail:{
        type: Array, of: String, default: []
    },
    weight: {
        type: Number,
        required: true
    },//Trọng lượng đơn hàng
    volume: {
        type: Number,
        required:true
    },//Khối lượng đồ đạc
    payment_method: {
        type: String,
        required: true
    },
    note_driver: {
        type:String,
        required: true
    },//Ghi chú cho tài xế
    status:{
        type: String, 
        default: 'Chưa thanh toán'
    }//Chưa thanh toán, đã thanh toán
}, { timestamps: true })

module.exports = mongoose.model('OrderDetail', orderDetailSchema)