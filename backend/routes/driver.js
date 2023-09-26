const router = require('express').Router()
const driverController = require("../controllers/driverController");

//Upload
const upload = require("../middlewares/upload");

router.post('/create_driver', upload.single("file"), driverController.createDriver)

//Show All Driver
router.get('/show_all_driver', driverController.getAllDriver)

//Update one field Driver (Status)
router.patch('/updateonefield_driver/:id', driverController.updateOneFieldDriver)

//Lock Driver Account
router.patch('/lockdriver_account/:username', driverController.lockDriverAccount)

//Get Driver Account
router.get('/getdriver_account/:username', driverController.getdriverAccount)


//Get All Driver Account
router.get('/getalldriver_account', driverController.getall_driverAccount)


//View Driver with ID
router.get('/view_detail_driver/:id', driverController.getDriverWithID)


// //Update Driver
router.put('/update_driver/:id', upload.single("file"), driverController.updateDriver)

// //Update one field Blog
// router.patch('/updateonefield_blog/:id', blogController.updateOneFieldBlog)



// //Delete Blog
// router.delete('/delete_blog/:id', blogController.deleteBlog);



// //View Detail blog with Title
// router.get('/view_detail_blog_title/:title', blogController.viewDetailBlogWithTitle)

module.exports = router;