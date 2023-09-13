const Customer = require('../models/Customer');
const User = require('../models/User')
const fs = require('fs');

const customerController = {
    //Get Info Customer
    getCustomer: async (req, res) => {
        try {
            const data_user = await User.findOne({ _id: req.params.id })
        
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
            // Lấy thông tin về file được upload
            const file = req.file;
            const data_object = req.body;

            let Customer_update = {}

            if (file) {
                Customer_update = {
                    fullname: data_object.fullname,
                    address: data_object.address,
                    avatar: file.path,
                    gender: data_object.gender,
                }
                //Thực hiện xóa ảnh cũ
                const imagePath = `${req.body.image_old}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } else {
                Customer_update = {
                    fullname: data_object.fullname,
                    address: data_object.address,
                    gender: data_object.gender,
                }
            }




            if (Customer_update) {
                const data_update_customer = await Customer.findByIdAndUpdate({ _id: data_object.id_customer }, Customer_update);
                if (data_update_customer) {
                    const user_update = {
                        fullname: data_object.fullname,
                        email: data_object.email,
                        phonenumber: data_object.phonenumber
                    }
                    const data_update_user = await User.findByIdAndUpdate({ _id: data_object.id_user }, user_update);
                    if (data_update_user) {
                        res.status(202).json(data_update_user);
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