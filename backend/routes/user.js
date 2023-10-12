const router = require('express').Router()
const userController = require("../controllers/userController");
const middlewareController = require("../controllers/middlewareController")

//GET ALL USER
router.get("/get_all_user", userController.get_all_user)

//Lock Account Customer
router.patch('/lock_account_customer/:id', userController.lockAccountCustomer)

//GET ALL USER
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//DELETE USER
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth,userController.deleteUser);

//Change password User
router.put('/change_password/:id', userController.changePassword)


module.exports = router;