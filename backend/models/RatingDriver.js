const mongoose = require('mongoose')

const ratingDriverSchema = new mongoose.Schema({
    rating_date: {
        type: String,
        required: true
    },
    star: {
        type: String,
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
    driver_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Driver',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('RatingDriver', ratingDriverSchema);