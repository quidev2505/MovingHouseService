const mongoose = require('mongoose')

const ratingServiceSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    order_id: {
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
    service_name: {
        type: String,
        required: true
    },
    rating_date: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('RatingService', ratingServiceSchema);