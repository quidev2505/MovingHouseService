const router = require('express').Router()
const serviceController = require("../controllers/serviceController");


//CRUD
//Create
router.post('/add_service', serviceController.createService);

//Read
router.get('/list_service', serviceController.readService);

//Update
router.put('/update_service', serviceController.updateService);

//Delete
router.delete('/delete_service', serviceController.deleteService);

module.exports = router;