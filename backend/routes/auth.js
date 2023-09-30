const authControllers = require('../controllers/authControllers');
const middlewareController = require("../controllers/middlewareController")

const router = require('express').Router();

//Register
router.post("/register", authControllers.registerUser);

//Login
router.post("/login", authControllers.loginUser);

//Refresh
router.post("/refresh", authControllers.requestRefreshToken)

//Log out
router.post("/logout", middlewareController.verifyToken, authControllers.userLogout)

//Forgot_password
router.post("/forgotPassword", authControllers.forgotPassword);

//Verify_OTP
router.post("/verify_otp", authControllers.verifyOTP);

//Change Password
router.post("/changePassword", authControllers.changePassword);

//Login with google
// router.post("/loginWithGoogle", authControllers.loginWithGoogle);


module.exports = router;