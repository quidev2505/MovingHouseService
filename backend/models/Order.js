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
        default: "Đang tìm tài xế"
    },
    //6 trạng thái
    // 1.Đang tìm tài xế
    // 2.Đang thực hiện
    // 3.Thanh toán hóa đơn
    // 4. Đã Hoàn thành
    // 5. Đã hủy
    //Nếu đã hủy đơn hàng
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