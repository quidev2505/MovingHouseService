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

module.exports = router;