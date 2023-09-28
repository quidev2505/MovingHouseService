const router = require('express').Router()
const adminController = require("../controllers/adminController");

//Upload
const upload = require("../middlewares/upload");

router.post('/create_admin', upload.single("file"), adminController.createAdmin)

//Show All Admin
router.get('/show_all_admin', adminController.getAllAdmin)

//Get All Admin Account
router.get('/getalladmin_account', adminController.getall_adminAccount)

//Get Admin Account With Username
router.get('/get_admin_account_with_username/:username', adminController.getadminAccountWithUserName)

//Update one field Admin (Status)
router.patch('/updateonefield_admin/:id', adminController.updateOneFieldAdmin)


//Update one field Admin Account (Status)
router.patch('/updateonefield_admin_account/:id', adminController.updateOneFieldAdminAccount)

// //Update one field Driver With Full name(Status)
// router.patch('/updateonefield_driver_withname/:fullname', driverController.updateOneFieldDriverWithFullName)

//Lock Admin Account
router.patch('/lockadmin_account/:username', adminController.lockAdminAccount)

//Get Admin Account
router.get('/getadmin_account/:username', adminController.getadminAccount)


//View Admin with ID
router.get('/view_detail_admin/:id', adminController.getAdminWithID)


// //Update Admin
router.put('/update_admin/:id', upload.single("file"), adminController.updateAdmin)



module.exports = router;