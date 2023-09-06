const router = require('express').Router()
const serviceController = require("../controllers/serviceController");


//CRUD
//Create
router.post('/add_service', serviceController.createService);

//Read
router.get('/list_service', serviceController.readService);

//Read Service Detail
router.get('/list_service/:id', serviceController.readServiceDetail);

//Update
router.put('/update_service/:id', serviceController.updateService);

//Delete
router.delete('/delete_service/:id', serviceController.deleteService);

module.exports = router;