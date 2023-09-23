const router = require('express').Router()
const vnpayMethodController = require("../controllers/vnpayMethod");


//CRUD
//Create Link
router.post('/create_payment_url', vnpayMethodController.create_link);


module.exports = router;