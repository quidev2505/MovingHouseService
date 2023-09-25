const mongoose = require('mongoose')

const driverAccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status_account: {
        type: Boolean,
        default: true
    }//Bị cấm, hoạt động
}, { timestamps: true })

module.exports = mongoose.model('DriverAccount', driverAccountSchema);