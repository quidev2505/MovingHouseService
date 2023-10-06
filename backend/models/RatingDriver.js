const mongoose = require('mongoose')

const ratingDriverSchema = new mongoose.Schema({
    rating_date: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },//Tên của khách hàng
    driver_name: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('RatingDriver', ratingDriverSchema);