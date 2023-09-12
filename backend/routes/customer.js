const router = require('express').Router();
const  customerController  = require('../controllers/customerController');

//Upload
const upload = require("../middlewares/upload");


//Get Customer
router.get('/get_customer_info/:id', customerController.getCustomer );

//Update Customer
router.post('/update_customer', upload.single("file"), customerController.updateCustomer);

module.exports = router;