const Customer = require('../models/Customer');
const User = require('../models/User')

const customerController = {
    //Get Info Customer
    getCustomer: async (req, res) => {
        try {

            const data_user = await User.findOne({_id: req.params.id})
            const data_customer = await Customer.findOne({ fullname: data_user.fullname });

            if (data_customer) {
                res.status(200).json(data_customer)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Update Customer
    updateCustomer: async (req, res) => {
        try {
            const data_object = req.body;

            const Customer_udpate = {
                fullname: data_object.fullname,
                address: data_object.address,
                avatar: data_object.avatar,
                gender: data_object.gender,
            }

            if (Customer_udpate) {
                const data_update_customer = await Customer.findByIdAndUpdate({ _id: data_object._id }, Customer_udpate);
                if (data_update_customer) {
                    const user_update = {
                        fullname: data_object.fullname,
                        email: data_object.email,
                        phonenumber: data_object.phonenumber
                    }
                    const data_update_user = await User.findByIdAndUpdate({ _id: data_object.id_user }, user_update);
                    if (data_update_user) {
                        res.status(202).json("update Success");
                    } else {
                        res.status(502).json("update Fail");

                    }
                }
            }
        } catch (e) {
            console.log(e)
            res.status(501).json("update Fail");

        }
    }

}

module.exports = customerController;