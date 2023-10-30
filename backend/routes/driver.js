const router = require('express').Router()
const driverController = require("../controllers/driverController");

//Upload
const upload = require("../middlewares/upload");

router.post('/create_driver', upload.single("file"), driverController.createDriver)

//Show All Driver
router.get('/show_all_driver', driverController.getAllDriver)

//Update one field Driver (Status)
router.patch('/updateonefield_driver/:id', driverController.updateOneFieldDriver)



//Update one field Driver With Full name(Status)
router.patch('/updateonefield_driver_withname/:fullname', driverController.updateOneFieldDriverWithFullName)

//Lock Driver Account
router.patch('/lockdriver_account/:username', driverController.lockDriverAccount)

//Get Driver Account
router.get('/getdriver_account/:username', driverController.getdriverAccount)

//Get Driver With Fullname
router.get('/getdriver_with_fullname/:fullname', driverController.getdriverWithFullname)

//Get All Driver Account
router.get('/getalldriver_account', driverController.getall_driverAccount)


//View Driver Detail with ID
router.get('/view_detail_driver/:id', driverController.getDriverWithID)


//View Driver Detail with username
router.get('/view_detail_driver_with_username/:username', driverController.getDriverWithUsername)

//Lấy dữ liệu đánh giá tài xế -> Sẵn tiện lấy dữ liệu số điện thoại hiện lên chi tiết đơn hàng
router.post('/get_arr_driver_info', driverController.getArrDriverInfo)

// //Update Driver
router.put('/update_driver/:id', upload.single("file"), driverController.updateDriver)


//Find Driver Advanced
router.post('/findDriverAdvanced', driverController.findDriverAdvaned)

//Find More Info Driver
router.get('/findMoreDriverInfo', driverController.findMoreDriverInfo)

// //Update one field Blog
// router.patch('/updateonefield_blog/:id', blogController.updateOneFieldBlog)



// //Delete Blog
// router.delete('/delete_blog/:id', blogController.deleteBlog);



// //View Detail blog with Title
// router.get('/view_detail_blog_title/:title', blogController.viewDetailBlogWithTitle)

module.exports = router;