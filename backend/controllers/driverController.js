const Driver = require('../models/Driver');
const DriverAccount = require('../models/DriverAccount')
const fs = require('fs');

const driverController = {
    //Create Driver
    createDriver: async (req, res) => {
        try {
            const data_input = req.body;

            // Lấy thông tin về file được upload
            const file = req.file;

            let IMG = ""
            if (file) {
                IMG = file.path;
            } else {
                IMG = req.body.imgURL
            }

            //Calculate Time at the moment
            // const now = new Date();
            // const vietnamTime = now.toLocaleString('vi-VN');
            // const time_now = vietnamTime.split(' ')[1]; 


            const data_driver = await new Driver({
                profile_code: data_input.profile_code,
                username: data_input.username,
                gender: data_input.gender,
                citizen_id: data_input.citizen_id,
                phonenumber: data_input.phonenumber,
                fullname: data_input.fullname,
                date_of_birth: data_input.date_of_birth,
                email: data_input.email,
                address: data_input.address,
                vehicle_type: data_input.vehicle_type,
                location_delivery: data_input.location_delivery,
                avatar: IMG
            })

            //Save Data Driver
            const data_driver_save = await data_driver.save();

            if (data_driver_save) {
                const data_driver_account = await new DriverAccount({
                    username: data_input.username,
                    password: data_input.password
                })

                //Save Data Driver Account
                const data_driver_account_save = await data_driver_account.save();

                if (data_driver_account_save) {
                    res.status(200).json('Create Driver Success')
                } else {
                    res.status(401).json('Error')
                }
            } else {
                res.status(401).json('Error')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //Get Info Driver
    getAllDriver: async (req, res) => {
        try {
            const data_driver = await Driver.find();

            if (data_driver) {
                res.status(200).json(data_driver)
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

module.exports = driverController;