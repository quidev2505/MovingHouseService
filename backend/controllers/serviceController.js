const Service = require('../models/Service');


const serviceController = {
    //CRUD 
    //Create
    createService: async (req, res) => {
        try {
            const service_data = await new Service({
                name: req.body.name,
                vehicle: req.body.vehicle,
                needPeople: req.body.needPeople,
                distance: req.body.distance,
                price: req.body.price,
                status: req.body.status,
                process: req.body.process,
                bonus: req.body.bonus,
                image: req.body.image,
                warranty_policy: req.body.warranty_policy,
                suitable_for: req.body.suitable_for
            })


            //Đưa dữ liệu vào DB
            const data_result = await service_data.save();

            if (data_result) {
                res.status(200).json('Success save service')
            } else {
                res.status(501).json('Fail save service')
            }
        } catch (err) {
            res.status(500).json(err);
            console.log(err)
        }
    },
    //Read
    readService: async (req, res) => {
        try {
            const data_service = await Service.find();

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
    //Detail Service
    readServiceDetail: async (req, res) => {
        try {
            const id = req.params.id;

            const data_service = await Service.findOne({_id: id});

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

    //Update
    updateService: async (req, res) => {
        try {
            const id_service = req.params.id;

            const data_update_from_client = req.body;

            const data_service = await Service.findOne({ _id: id_service });

            if (data_service) {
                const data_update = await Service.findByIdAndUpdate(id_service, { data_update_from_client })

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
    deleteService: async (req, res) => {
        try {
            const id_service = req.params.id;

            const check_delete = await Service.findByIdAndDelete(id_service);
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

module.exports = serviceController;