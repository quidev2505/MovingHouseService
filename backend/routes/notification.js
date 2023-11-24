const router = require('express').Router()
const notificationController = require("../controllers/notificationController");
const middlewareController = require("../controllers/middlewareController");


//Tạo thông báo đơn hàng
router.post('/createNotification', notificationController.createNotification);

//Hiển thị ra List thông báo
router.get('/showNotification',middlewareController.verifyToken, notificationController.showNotification);

//Hiển thị ra List thông báo với id_customer từng loại kahsch hàng
router.get('/showNotificationWithID/:id_customer', middlewareController.verifyToken, notificationController.showNotificationWithIdCustomer);

//Xóa thông báo
router.delete('/deleteNotify/:id', middlewareController.verifyToken, notificationController.deleteNotify);

module.exports = router;