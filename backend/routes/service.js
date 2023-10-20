const router = require('express').Router()
const serviceController = require("../controllers/serviceController");

//Upload
const upload = require("../middlewares/upload");


//CRUD
//Create
router.post('/add_service', upload.single("file"), serviceController.createService);

//Read
router.get('/list_service', serviceController.readService);

//Read Service Detail
router.get('/list_service/:id', serviceController.readServiceDetail);

//Read Service Detail with name
router.get('/list_service_name/:name', serviceController.readServiceDetailWithName);

//Update
router.put('/update_service/:id', upload.single("file") ,serviceController.updateService);

//Update One Field
router.patch('/update_one_field_service/:id', serviceController.updateOneFieldService);

//Delete
router.delete('/delete_service/:id', serviceController.deleteService);

module.exports = router;