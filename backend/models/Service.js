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
    },
    distance: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
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