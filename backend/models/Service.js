const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    vehicle: {
        type: String,
        required: true
    },
    needPeople: {
        type: Number,
        required: true
        // Tùy thuộc vào số lượng đồ đạc và quãng đường di chuyển nếu là 0
    },
    distance: {
        type: String,
        required: true
        // Tùy thuộc vào yêu cầu của khách hàng
    },
    price: {
        type: Number,
        required: true
        // Nếu là 0 thì sẽ Tùy thuộc vào nhu cầu và yêu cầu của khách hàng
    },
    status: {
        type: Boolean,
        requierd: true,
        default: true
    },
    process: { type: Array, of: String, default: [] }
    ,
    bonus: { type: Array, of: String, default: [] }
    ,
    image: {
        type: String,
        required: true,
        default: null
    },
    warranty_policy: {
        type: String,
        required: true
    },
    suitable_for: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Service', serviceSchema);