const router = require('express').Router()
const adminAccountController = require("../controllers/adminAccountController");

//Login Admin
router.post('/login', adminAccountController.loginAdmin)

//Change password
router.put('/change_password/:id', adminAccountController.changePasswrod)

module.exports = router;