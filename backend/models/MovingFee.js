const mongoose = require('mongoose')

const movingFeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priceFirst10km: {
        type: Number,
        required: true
    },
    priceFrom11to45:{
        type:Number,
        required: true
    },
    pricePer45km:{
        type:Number,
        required: true
    },
    waiting_fee:{
        type:Number,
        required:true
    },
    TwowayFloor_loadingFee:{
        type: Number,
        required: true
    },
    OnewayFloor_loadingFee:{
        type: Number,
        required: true
    },
    Twoway_loadingFee:{
        type: Number,
        required: true
    },
    Oneway_loadingFee:{
        type: Number,
        required: true
    },  
    status: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

module.exports = mongoose.model('MovingFee', movingFeeSchema);