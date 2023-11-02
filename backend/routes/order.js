const router = require('express').Router()
const orderController = require("../controllers/orderController");


//Tìm thông tin đơn hàng với siêu filter
router.post('/findOrder', orderController.findOrder);

//Tìm thông tin đơn hàng với siêu filter (Phía Admin)
router.post('/findOrderAdmin', orderController.findOrderAdmin);

//create Order
router.post('/create_order', orderController.createOrder)


// View All Order
router.get('/viewAllOrder', orderController.viewAllOrder)

// Xem khu vực vận chuyển
router.get('/viewDeliveryArea', orderController.viewDeliveryArea)

// View Order With Order Id
router.get('/viewOrderWithOrderId/:order_id', orderController.ViewOrderWithOrderId)


// View Order with customer_id
router.get('/viewOrderWithCustomerId/:id_customer', orderController.viewOrderWithIdCustomer)


// View Order Detail with id order detail
router.get('/viewOrderDetail/:order_detail_id', orderController.viewOrderWithOrderDetailId)


//Update one field Order
router.patch('/updateonefield_order/:id_order', orderController.updateOneFieldOrder)

//Update one field Order Detail
router.patch('/updateonefield_order_detail/:id_order_detail', orderController.updateOneFieldOrderDetail)


//Đánh giá dịch vụ và tài xế
router.post(`/rating_order/:order_id`, orderController.ratingOrder);

//Lấy đánh giá đơn hàng ra
router.get(`/getRating_Order/:order_id`, orderController.getRatingOrder)

//Lấy thông tin đơn hàng
router.post('/findDataOrder', orderController.findDataOrder);

// //Update one field Blog
// router.patch('/updateonefield_blog/:id', blogController.updateOneFieldBlog)

// //Update Blog
// router.put('/update_blog/:id', upload.single("file"), blogController.updateBlog)

// //Delete Blog
// router.delete('/delete_blog/:id', blogController.deleteBlog);

// //View Detail blog with ID
// router.get('/view_detail_blog/:id', blogController.viewDetailBlog)

// //View Detail blog with Title
// router.get('/view_detail_blog_title/:title', blogController.viewDetailBlogWithTitle)

module.exports = router;