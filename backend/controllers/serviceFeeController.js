const ServiceFee = require('../models/ServiceFee');


const serviceFeeController = {
    //CRUD 
    //Create
    createServiceFee: async (req, res) => {
        try {
            const service_data = await new ServiceFee({
                fee_name: req.body.fee_name,
                price: req.body.price,
                unit: req.body.unit,
                status: req.body.status,
            })

            //Đưa dữ liệu vào DB
            const data_result = await service_data.save();

            if (data_result) {
                res.status(200).json('Success save service fee')
            } else {
                res.status(501).json('Fail save service fee')
            }
        } catch (err) {
            res.status(500).json(err);
            console.log(err)
        }
    },
    //Read
    readServiceFee: async (req, res) => {
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
    readServiceFeeDetail: async (req, res) => {
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
    updateServiceFee: async (req, res) => {
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
    updateOneFieldServiceFee: async (req, res) => {
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
    deleteServiceFee: async (req, res) => {
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

module.exports = serviceFeeController;