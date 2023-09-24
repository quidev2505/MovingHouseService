const router = require('express').Router()
const orderController = require("../controllers/orderController");


//create Order
router.post('/create_order', orderController.createOrder)

// View Order with customer_id
router.get('/viewOrderWithCustomerId/:id_customer', orderController.viewOrderWithIdCustomer)

// View Order Detail with id order detail
router.get('/viewOrderDetail/:order_detail_id', orderController.viewOrderWithOrderDetailId)


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