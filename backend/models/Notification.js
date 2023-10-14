const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: "vừa được tạo !"
    },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema);