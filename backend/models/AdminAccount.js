const mongoose = require('mongoose')

const adminAccountSchema = new mongoose.Schema({
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
    },//Bị cấm, hoạt động
    department: {
        type: String,
        default: "Nhân sự"
    },
    avatar: {
        type: String,
        required:true
    },
    otp_code: {
        type: String,
        maxLength: 6,
        default: null
    }

}, { timestamps: true })

module.exports = mongoose.model('AdminAccount', adminAccountSchema);