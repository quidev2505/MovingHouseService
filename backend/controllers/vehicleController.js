const MovingFee = require('../models/MovingFee');
const Vehicle = require('../models/Vehicle');
const fs = require('fs');


const vehicleController = {
    //CRUD 
    //Create
    createVehicle: async (req, res) => {
        try {

            // Lấy thông tin về file được upload
            const file = req.file;

            let IMG = ""
            if (file) {
                IMG = file.path;
            } else {
                IMG = req.body.imgURL
            }

            const movingfee_data = await new MovingFee({
                name: req.body.name,
                priceFirst10km: req.body.priceFirst10km,
                priceFrom11to45: req.body.priceFrom11to45,
                pricePer45km: req.body.pricePer45km,
                waiting_fee: req.body.waiting_fee,
                TwowayFloor_loadingFee: req.body.TwowayFloor_loadingFee,
                OnewayFloor_loadingFee: req.body.OnewayFloor_loadingFee,
                Twoway_loadingFee: req.body.Twoway_loadingFee,
                Oneway_loadingFee: req.body.Oneway_loadingFee,
            })

            //Đưa dữ liệu vào DB
            const DB_movingfee = await movingfee_data.save();

            if (DB_movingfee) {
                const vehicle_data = await new Vehicle({
                    vehicle_name: req.body.name,
                    brand: req.body.brand,
                    capacity: req.body.capacity,
                    moving_ban_time: req.body.moving_ban_time,
                    status: req.body.status,
                    cago_size: req.body.cago_size,
                    suitable_for: req.body.suitable_for,
                    image: IMG,
                    movingFee_id: DB_movingfee.id
                })

                const data_result = await vehicle_data.save()

                if (data_result) {
                    res.status(200).json('Success save service fee')
                } else {
                    res.status(501).json('Fail save service fee')
                }
            }

        } catch (err) {
            res.status(500).json(err);
            console.log(err)
        }
    },
    //Read
    readVehicle: async (req, res) => {
        try {
            const data_service = await Vehicle.find();

            if (data_service) {
                res.status(200).json(data_service);
            } else {
                res.status(501).json('Fail to load data !');
            }
        } catch (err) {
            console.log(err)
            res.status(501).json('Fail to load data !');
        }
    },
    //Read
    readMovingFee: async (req, res) => {
        try {
            const data_moving_fee = await MovingFee.find();

            if (data_moving_fee) {
                res.status(200).json(data_moving_fee);
            } else {
                res.status(501).json('Fail to load data !');
            }
        } catch (err) {
            console.log(err)
            res.status(501).json('Fail to load data !');
        }
    },
    getMoving_Price: async (req, res) => {
        try {
            const name = req.body;

            const data_fee = await MovingFee.findOne({ name: name.name_vehicle });

            if (data_fee) {
                res.status(200).json(data_fee);
            } else {
                res.status(501).json('Fail to load data !');
            }
        } catch (err) {
            res.status(501).json('Fail to load data !');
        }
    },
    // Detail Service
    readVehicleDetail: async (req, res) => {
        try {
            const id = req.params.id;

            const data_service = await Vehicle.findOne({ _id: id });

            if (data_service) {
                res.status(200).json(data_service);
            } else {
                res.status(501).json('Fail to load data !');
            }
        } catch (err) {
            console.log(err)
            res.status(501).json('Fail to load data !');
        }
    },

    // Detail Service
    readMovingFeeDetail: async (req, res) => {
        try {
            const id = req.params.id;

            const data_service = await Vehicle.findOne({ _id: id });

            if (data_service) {
                const data_moving_fee = await data_service.populate('movingFee_id');

                if (data_moving_fee) {
                    res.status(200).json(data_moving_fee);
                } else {
                    res.status(501).json('Fail to load data !');
                }
            }

        } catch (err) {
            console.log(err)
            res.status(501).json('Fail to load data !');
        }
    },



    //Update All
    updateVehicle: async (req, res) => {
        try {
            const id_vehicle = req.params.id;

            // Lấy thông tin về file được upload
            const file = req.file;

            let vehicle_data = {}
            if (file) {
                vehicle_data = {
                    vehicle_name: req.body.name,
                    brand: req.body.brand,
                    capacity: req.body.capacity,
                    moving_ban_time: req.body.moving_ban_time,
                    status: req.body.status,
                    cago_size: req.body.cago_size,
                    suitable_for: req.body.suitable_for,
                    image: file.path
                }
                //Thực hiện xóa ảnh cũ
                const imagePath = `${req.body.image_old}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } else {
                if (req.body.imgURL !== "") {
                    vehicle_data = {
                        vehicle_name: req.body.name,
                        brand: req.body.brand,
                        capacity: req.body.capacity,
                        moving_ban_time: req.body.moving_ban_time,
                        status: req.body.status,
                        cago_size: req.body.cago_size,
                        suitable_for: req.body.suitable_for,
                        image: req.body.imgURL
                    }
                } else {
                    vehicle_data = {
                        vehicle_name: req.body.name,
                        brand: req.body.brand,
                        capacity: req.body.capacity,
                        moving_ban_time: req.body.moving_ban_time,
                        status: req.body.status,
                        cago_size: req.body.cago_size,
                        suitable_for: req.body.suitable_for,
                    }

                }

            }


            const data_update_vehicle = await Vehicle.findByIdAndUpdate(id_vehicle, vehicle_data, { new: true })

            const moving_fee = {
                name: req.body.name,
                priceFirst10km: req.body.priceFirst10km,
                priceFrom11to45: req.body.priceFrom11to45,
                pricePer45km: req.body.pricePer45km,
                waiting_fee: req.body.waiting_fee,
                TwowayFloor_loadingFee: req.body.TwowayFloor_loadingFee,
                OnewayFloor_loadingFee: req.body.OnewayFloor_loadingFee,
                Twoway_loadingFee: req.body.Twoway_loadingFee,
                Oneway_loadingFee: req.body.Oneway_loadingFee,
            }

            if (data_update_vehicle) {
                const data_update_movingFee = await MovingFee.findByIdAndUpdate(data_update_vehicle.movingFee_id, moving_fee, { new: true })
                if (data_update_movingFee) {
                    res.status(200).json('Update Success');
                } else {
                    res.status(501).json('Update Fail');
                }
            }



        } catch (err) {
            console.log(err)
            res.status(501).json('Fail to update !');
        }
    },

    //Update One Field
    updateOneFieldVehicle: async (req, res) => {
        try {
            const id_service = req.params.id;

            const data_update_from_client = req.body;


            const data_service = await Vehicle.findOne({ _id: id_service });

            const id_moving_fee = data_service.movingFee_id;

            if (data_service) {
                const data_update = await Vehicle.updateOne({ _id: id_service }, data_update_from_client, { new: true })

                const data_moving_fee_update = await MovingFee.updateOne({ _id: id_moving_fee }, data_update_from_client, { new: true })


                if (data_update && data_moving_fee_update) {
                    res.status(200).json('Update Success');
                } else {
                    res.status(501).json('Update Fail');
                }
            } else {
                res.status(501).json('Update Fail');
            }
        } catch (err) {
            console.log(err)
            res.status(501).json('Fail to update !');
        }
    },
    //Delete
    deleteVehicle: async (req, res) => {
        try {
            const id_vehicle = req.params.id;

            const data_vehicle = await Vehicle.findOne({ _id: id_vehicle });



            const id_moving_fee = data_vehicle.movingFee_id;

            const check_delete_vehicle = await Vehicle.findByIdAndDelete(id_vehicle);

            if (check_delete_vehicle) {
                const check_delete_movingFee = await MovingFee.findByIdAndDelete(id_moving_fee);
                if (check_delete_movingFee) {
                    //Thực hiện xóa ảnh cũ
                    const imagePath = `${data_vehicle.image}`;
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                    res.status(200).json('Delete Success');
                } else {
                    res.status(501).json('Delete Fail');
                }
            }

        } catch (err) {
            console.log(err)
            res.status(501).json('Delete Fail');
        }
    }
}

module.exports = vehicleController;