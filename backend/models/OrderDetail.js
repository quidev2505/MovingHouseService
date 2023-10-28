const mongoose = require('mongoose')

const orderDetailSchema = new mongoose.Schema({
    distance: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    fromLocation_detail: {
        type: String,
        required: true
    },
    toLocation_detail: {
        type: String,
        required: true
    },
    man_power_quantity: {
        type: Number,
        required: true
    },
    man_power_price: {
        type: Number,
        required: true
    },
    moving_fee: {
        type: Array, of: Object, default: []
    },
    service_fee: {
        type: Array, of: Object, default: []
    },
    item_detail: {
        type: Array, of: String, default: []
    },
    // weight: {
    //     type: Number,
    //     default: 0,
    // },//Trọng lượng đơn hàng
    // volume: {
    //     type: Number,
    //     default: 0,
    // },//Khối lượng đồ đạc
    payment_method: {
        type: String,
        required: true
    },
    totalOrder: {
        type: Number,
        required: true
    },
    more_fee_name: {
        type: String,
        default: null
    },
    more_fee_price: {
        type: Number,
        default: 0
    },
    vehicle_price: {
        type: Number,
        required: true
    },//Giá thuê xe
    totalOrderNew: {
        type: Number,
        default: 0
    },//Tổng đơn hàng mới
    note_driver: {
        type: String,
        required: true
    },//Ghi chú cho tài xế
    payment_status: {
        type: String,
        default: 'Chưa thanh toán'
    }//Chưa thanh toán, đã thanh toán

}, { timestamps: true })

module.exports = mongoose.model('OrderDetail', orderDetailSchema)