const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    vehicle_name:{
        type:String,
        required: true
    },
    brand: {
        type:String, 
        required: true
    },
    capacity: {
        type:String, 
        required: true
    },
    moving_ban_time:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required: true,
        default: true
    },
    cago_size:{
        type:String,
        required: true
    },
    suitable_for:{
        type:String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    movingFee_id: {
        type: mongoose.Types.ObjectId, 
        ref:'MovingFee',
        required:true
    }
    
}, { timestamps: true })

module.exports = mongoose.model('Vehicle', vehicleSchema);