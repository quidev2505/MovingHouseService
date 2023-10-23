const router = require('express').Router()
const notificationController = require("../controllers/notificationController");

//Tạo thông báo đơn hàng
router.post('/createNotification', notificationController.createNotification);

//Hiển thị ra List thông báo
router.get('/showNotification', notificationController.showNotification);

//Hiển thị ra List thông báo với id_customer từng loại kahsch hàng
router.get('/showNotificationWithID/:id_customer', notificationController.showNotificationWithIdCustomer);

//Xóa thông báo
router.delete('/deleteNotify/:id', notificationController.deleteNotify);

module.exports = router;