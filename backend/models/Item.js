const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status:{
        type:Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Item', itemSchema);