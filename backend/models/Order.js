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
        required: true
    },//Ngày tạo đơn hàng - giờ
    service_name: {
        type: String,
        required: true
    },
    date_start: {
        type: String,
        required: true
    },//Ngày vận chuyển // 27 tháng 8 năm 2023
    time_start: {
        type: String,
        required: true
    },//Thời gian bắt đầu
    date_end: {
        type: String,
        default: null
    },//Ngày kết thúc vận chuyển // 27 tháng 8 năm 2023
    fromLocation: {
        type: String,
        required: true
    }, //Dạng: địa chỉ 
    toLocation: {
        type: String,
        required: true
    }, //Dạng: địa chỉ
    deliveryArea: {
        type: String,
        required: true
    },
    vehicle_name: {
        type: String,
        required: true
    },//Tên phương tiện
    driver_name: {
        type: Array, of: String, default: []
    },//Mảng tên của tài xế
    totalOrder: {
        type: Number,
        required: true
    },//Tổng đơn hàng hiện tại
    order_detail_id: {
        type: mongoose.Types.ObjectId,
        ref: 'OrderDetail',
        required: true
    },
    status: {
        type: String,
        default: "Đang xử lý"
    },
    //7 trạng thái
    //1. Đang xử lý
    // 2.Đang tìm tài xế
    // 3.Đang thực hiện
    // 4.Thanh toán hóa đơn
    // 5. Đã Hoàn thành
    // 6. Đã hủy
    //Nếu đã hủy đơn hàng
    //Chữ kí điện thử để xác thực xem có kí tên vào hợp đồng chưa
    electronic_signature:{
        type: String,
        default:null
    },
    reason_cancel: {
        type: String,
        default: null
    },
    order_receiver: {
        type: String,
        default: null
    }

}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);