const router = require('express').Router()
const vehicleController = require("../controllers/vehicleController");


//Upload
const upload = require("../middlewares/upload");


//CRUD
//Create
router.post('/add_vehicle', upload.single("file"), vehicleController.createVehicle);

//Read
router.get('/list_vehicle', vehicleController.readVehicle);

//Read
router.get('/list_movingFee', vehicleController.readMovingFee);

// Read Service Detail
router.get('/list_vehicle/:id', vehicleController.readVehicleDetail);

//Get Moving Fee with name
router.post("/moving_fee", vehicleController.getMoving_Price);

//Read Moving Fee
router.get("/moving_fee/:id", vehicleController.readMovingFeeDetail)

//Update
router.put('/update_vehicle/:id', upload.single("file") ,vehicleController.updateVehicle);

//Update One Field
router.patch('/update_one_field_vehicle/:id', vehicleController.updateOneFieldVehicle);

//Delete
router.delete('/delete_vehicle/:id', vehicleController.deleteVehicle);

module.exports = router;