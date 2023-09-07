const router = require('express').Router()
const serviceFeeController = require("../controllers/serviceFeeController");


//CRUD
//Create
router.post('/add_service_fee', serviceFeeController.createServiceFee);

//Read
router.get('/list_service_fee', serviceFeeController.readServiceFee);

// Read Service Detail
router.get('/list_service_fee/:id', serviceFeeController.readServiceFeeDetail);

//Update
router.put('/update_service_fee/:id', serviceFeeController.updateServiceFee);

//Update One Field
router.patch('/update_one_field_service_fee/:id', serviceFeeController.updateOneFieldServiceFee);

//Delete
router.delete('/delete_service_fee/:id', serviceFeeController.deleteServiceFee);

module.exports = router;