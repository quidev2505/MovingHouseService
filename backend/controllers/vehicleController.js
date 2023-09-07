const MovingFee = require('../models/MovingFee');
const Vehicle = require('../models/Vehicle');



const vehicleController = {
    //CRUD 
    //Create
    createVehicle: async (req, res) => {
        try {
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
                return_fee: req.body.return_fee
            })

            //Đưa dữ liệu vào DB
            const DB_movingfee = await movingfee_data.save();

            if (DB_movingfee) {
                const vehicle_data = await new Vehicle({
                    name: req.body.name,
                    brand: req.body.brand,
                    capacity: req.body.capacity,
                    status: req.body.status,
                    cago_size: req.body.cago_size,
                    suitable_for: req.body.suitable_for,
                    image: req.body.image,
                    suitable_for: req.body.suitable_for,
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
            const data_service = await ServiceFee.find();

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
    readVehicleDetail: async (req, res) => {
        try {
            const id = req.params.id;

            const data_service = await ServiceFee.findOne({ _id: id });

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

    //Update All
    updateVehicle: async (req, res) => {
        try {
            const id_service = req.params.id;

            const data_update_from_client = req.body;


            const data_service = await ServiceFee.findOne({ _id: id_service });


            if (data_service) {
                const data_update = await ServiceFee.findByIdAndUpdate(id_service, data_update_from_client, { new: true })


                if (data_update) {
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

    //Update One Field
    updateOneFieldVehicle: async (req, res) => {
        try {
            const id_service = req.params.id;

            const data_update_from_client = req.body;


            const data_service = await ServiceFee.findOne({ _id: id_service });


            if (data_service) {
                const data_update = await ServiceFee.updateOne({ _id: id_service }, data_update_from_client, { new: true })


                if (data_update) {
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
            const id_service = req.params.id;

            const check_delete = await ServiceFee.findByIdAndDelete(id_service);
            if (check_delete) {
                res.status(200).json('Delete Success');
            } else {
                res.status(501).json('Delete Fail');
            }
        } catch (err) {
            console.log(err)
            res.status(501).json('Delete Fail');
        }
    }
}

module.exports = vehicleController;