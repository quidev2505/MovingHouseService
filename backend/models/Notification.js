const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: "Có đơn hàng mới vừa được tạo !"
    },
    id_customer: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema);