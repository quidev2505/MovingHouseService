const router = require('express').Router();
const  customerController  = require('../controllers/customerController');

//Get Customer
router.get('/get_customer_info/:fullname', customerController.getCustomer );

//Update Customer
router.post('/update_customer', customerController.updateCustomer);

module.exports = router;