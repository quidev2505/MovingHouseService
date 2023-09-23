const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    customer_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    date_created: {
        type: String,
        required:true
    },//Ngày tạo đơn hàng
    service_name: {
        type:String,
        required: true
    },
    date_start: {
        type:String,
        required: true 
    },//Ngày vận chuyển // 27 tháng 8 năm 2023
    time_start:{
        type: String,
        required: true
    },//Thời gian bắt đầu
    date_end: {
        type: String,
        default: ""
    },//Ngày kết thúc vận chuyển // 27 tháng 8 năm 2023
    fromLocation: {
        type:String,
        required: true
    }, //Dạng: địa chỉ 
    toLocation: {
        type: String,
        required: true
    }, //Dạng: địa chỉ
    vehicle_name:{
        type: Number,
        required:true
    },//Tên phương tiện
    driver_id:{
        type: mongoose.Types.ObjectId,
        ref: 'Driver',
        default: null
    },//Id của tài xế
    totalOrder:{
        type:Number,
        required: true
    },//Tổng đơn hàng
    order_detail_id:{
        type: mongoose.Types.ObjectId,
        ref: 'OrderDetail',
        required: true
    },
    status:{
        type:String,
        default: "Đang tìm tài xế"
    }
    //6 trạng thái
    // 1.Đang tìm tài xế
    // 2.Đang thực hiện
    // 3. Xác nhận hóa đơn
    // 4.Thanh toán hóa đơn
    // 5. Hoàn thành
    // 6. Đã hủy

}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);