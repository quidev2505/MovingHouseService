const router = require('express').Router()
const adminController = require("../controllers/adminController");

//Login Admin
router.post('/login', adminController.loginAdmin)

//Chang password
router.put('/change_password/:id', adminController.changePasswrod)

module.exports = router;