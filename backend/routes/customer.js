const router = require('express').Router();
const  customerController  = require('../controllers/customerController');

//Upload
const upload = require("../middlewares/upload");

//Get Info with Customer_name
router.get('/get_info_user_with_customer_name/:customer_name', customerController.getInfoUserWithCustomerName)

//Get Customer With Fullname
router.get('/get_customer_with_fullname/:fullname', customerController.getCustomerWithFullName)

//Get Customer With ID Customer
router.get('/get_customer_with_id/:id', customerController.getCustomerWithIDCustomer)

//Get Customer With ID User
router.get('/get_customer_info/:id', customerController.getCustomer);

//Update Customer
router.post('/update_customer', upload.single("file"), customerController.updateCustomer);

module.exports = router;