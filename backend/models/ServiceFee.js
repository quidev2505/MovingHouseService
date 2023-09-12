const mongoose = require('mongoose')

const serviceFeeSchema = new mongoose.Schema({
    fee_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
        // Nếu là 0 thì sẽ Tùy thuộc vào nhu cầu và yêu cầu của khách hàng
    },
    unit:{
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

module.exports = mongoose.model('ServiceFee', serviceFeeSchema);