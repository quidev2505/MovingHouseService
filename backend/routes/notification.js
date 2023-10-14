const router = require('express').Router()
const notificationController = require("../controllers/notificationController");

//Tạo thông báo đơn hàng
router.post('/createNotification', notificationController.createNotification);

//Hiển thị ra List thông báo
router.get('/showNotification', notificationController.showNotification);

module.exports = router;