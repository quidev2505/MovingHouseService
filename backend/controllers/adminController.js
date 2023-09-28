const Admin = require('../models/Admin');
const AdminAccount = require('../models/AdminAccount')
const fs = require('fs');
const bcrypt = require('bcrypt');

const adminController = {
    //Create Admin
    createAdmin: async (req, res) => {
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

            //Mã hóa mật khẩu 
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(data_input.password, salt);


            const data_admin = await new Admin({
                profile_code: data_input.profile_code,
                username: data_input.username,
                gender: data_input.gender,
                citizen_id: data_input.citizen_id,
                phonenumber: data_input.phonenumber,
                fullname: data_input.fullname,
                date_of_birth: data_input.date_of_birth,
                email: data_input.email,
                address: data_input.address,
                avatar: IMG,
                department: data_input.department
            })

            //Save Data Admin
            const data_admin_save = await data_admin.save();

            if (data_admin_save) {
                const data_admin_account = await new AdminAccount({
                    username: data_input.username,
                    password: hashed,
                    department: data_input.department,
                    avatar: IMG
                })

                //Save Data Admin Account
                const data_admin_account_save = await data_admin_account.save();

                if (data_admin_account_save) {
                    res.status(200).json('Create Admin Success')
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
    //Get Info Admin
    getAllAdmin: async (req, res) => {
        try {
            const data_admin = await Admin.find();

            if (data_admin) {
                res.status(200).json(data_admin)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },

    //Get Info Admin Detail with ID
    getAdminWithID: async (req, res) => {
        try {
            const id_admin = req.params.id;

            const data_admin = await Admin.findOne({ _id: id_admin });

            if (data_admin) {
                res.status(200).json(data_admin)
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
    },

    //Update one field Admin(Status Admin)
    updateOneFieldAdmin: async (req, res) => {
        try {
            const id_admin = req.params.id;

            const dataUpdateOne = await Admin.updateOne({ _id: id_admin }, req.body, { new: true });
            if (dataUpdateOne) {
                res.status(201).json('update success');
            } else {
                res.status(501).json('update fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //Update one field Admin Account(Status Admin)
    updateOneFieldAdminAccount: async (req, res) => {
        try {
            const id_admin_account = req.params.id;

            const dataUpdateOne = await AdminAccount.updateOne({ _id: id_admin_account }, req.body, { new: true });
            if (dataUpdateOne) {
                res.status(201).json('update success');
            } else {
                res.status(501).json('update fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Update one field Driver With fullname(Status Driver)
    updateOneFieldDriverWithFullName: async (req, res) => {
        try {
            const fullname_driver = req.params.fullname;

            const dataUpdateOne = await Driver.updateOne({ fullname: fullname_driver }, req.body, { new: true });
            if (dataUpdateOne) {
                res.status(201).json('update success');
            } else {
                res.status(501).json('update fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Lock Admin Account
    lockAdminAccount: async (req, res) => {
        try {
            const username_admin = req.params.username;

            const dataUpdateOne = await AdminAccount.updateOne({ username: username_admin }, req.body, { new: true });
            if (dataUpdateOne) {
                res.status(201).json('update success');
            } else {
                res.status(501).json('update fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Get Admin Account
    getadminAccount: async (req, res) => {
        try {
            const username_admin = req.params.username;

            const data_admin_account = await AdminAccount.findOne({ username: username_admin })
            if (data_admin_account) {
                res.status(201).json(data_admin_account);
            } else {
                res.status(501).json('update fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },


    //Get All Admin Account
    getall_adminAccount: async (req, res) => {
        try {
            const data_admin_account = await AdminAccount.find()
            if (data_admin_account) {
                res.status(201).json(data_admin_account);
            } else {
                res.status(501).json('Fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },


    //Get Admin Account With ID
    getadminAccountWithUserName: async (req, res) => {
        try {
            const username_account = req.params.username;
            const data_admin_account = await AdminAccount.findOne({username: username_account});
            if (data_admin_account) {
                res.status(201).json(data_admin_account);
            } else {
                res.status(501).json('Fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //update Admin
    updateAdmin: async (req, res) => {
        try {
            const id = req.params.id;

            // Lấy thông tin về file được upload
            const file = req.file;

            if (file) {
                req.body.avatar = file.path

                //Thực hiện xóa ảnh cũ
                const imagePath = `${req.body.img_old}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } else {
                req.body.avatar = req.body.imgURL || req.body.avatar
            }

            const check_update = await Admin.findByIdAndUpdate(id, req.body);
            if (check_update) {
                res.status(201).json('Update success')
            } else {
                res.status(501).json('Update fail')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e);
        }
    },


}

module.exports = adminController;