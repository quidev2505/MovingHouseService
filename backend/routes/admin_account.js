const router = require('express').Router()
const adminAccountController = require("../controllers/adminAccountController");

//Login Admin
router.post('/login', adminAccountController.loginAdmin)

//Change password
router.put('/change_password/:id', adminAccountController.changePasswrod)

//Forgot_password
router.post("/forgotPassword", adminAccountController.forgotPassword);

//Verify_OTP
router.post("/verify_otp", adminAccountController.verifyOTP);

//Change Password Admin
router.post("/changePasswordAdmin", adminAccountController.changePasswordAdmin);

module.exports = router;