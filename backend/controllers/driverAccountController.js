const DriverAccount = require('../models/DriverAccount');
// const Admin = require('../models/Admin');
const nodemailer = require("nodemailer");
const OTP = require('one-time-password')

const bcrypt = require('bcrypt');

const driverAccountController = {
    //Login
    loginDriver: async (req, res) => {
        try {
            const driver_account = await DriverAccount.findOne({ username: req.body.username });

            //Compare password
            const validPassword = await bcrypt.compare(
                req.body.password,
                driver_account.password
            )

            if (!validPassword) {
                return res.status(404).json("Wrong password !")
            } else {
                if (driver_account.status_account === false) {
                    return res.status(404).json("Ban Account")
                }
            }

            //Khi đăng nhập thành công
            const { password, ...others } = driver_account._doc;
            return res.status(200).json(others)

        } catch (err) {
            console.log(err)
            return res.status(500).json(err);
        }
    },


    //Change Password
    changePasswrod: async (req, res) => {
        try {
            const id_input = req.params.id; //Get ID admin-account want to change

            const data_old = await AdminAccount.findOne({ _id: id_input });

            // console.log(data_old.password)
            // console.log(req.body.password_current);


            //Compare password
            const validPassword = await bcrypt.compare(
                req.body.password_current,
                data_old.password
            )


            if (!validPassword) {
                return res.status(404).json("Wrong password !")
            }

            //Mã hóa mật khẩu trước khi đưa vào
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password_new, salt);

            const data_new = await AdminAccount.findByIdAndUpdate(id_input, { password: hashed });


            if (data_new) {
                res.status(200).json('Success update password')
            } else {
                res.status(505).json('Fail to update password !');
            }

        } catch (e) {
            res.status(505).json(e);
        }
    },

    //Forgot password (1)
    forgotPassword: async (req, res) => {
        let email_otp = req.body.email_input;

        //Get _id from User DB
        let get_id = await Admin.findOne({ email: email_otp });
        console.log(get_id)

        //Generator OTP
        // A base32-encoded key.
        const dummyKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

        // Derive a 6-digit, time-based token from 'dummyKey'.
        const token = OTP.generate(dummyKey);

        //Update OTP into DB User
        if (get_id) {
            await AdminAccount.updateOne({ username: get_id.username }, { otp_code: token });
        }

        //Check Email is already register
        let checkExistEmailRegister = await Admin.findOne({ email: email_otp });
        if (checkExistEmailRegister) {
            //Nodemailer - Send email !
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "quidev2505@gmail.com",
                    pass: process.env.PASS_GGMAIL
                }
            });

            const mailOptions = {
                from: "quidev2505@gmail.com",
                to: `${email_otp}`,
                subject: " 🚚 [FastMove]",
                html: `Mã OTP 6 số để khôi phục mật khẩu của bạn là : <h1 style="color:red">${token}</h1>`
            }

            //Nodemailer 
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Email sent:" + info.response);
                }
            })


            res.status(200).json('Send Email Successfully !');
        } else {
            res.status(404).json('NotRegisterEmail');
        }
    },

    //Verify Token OTP Admin(2)
    verifyOTP: async (req, res) => {
        let email_otp = req.body.email_input;
        let otp_input = req.body.otp_input;

        //Get Data from Admin DB
        let dataAdmin = await Admin.findOne({ email: email_otp });

        let username_admin_account = dataAdmin.username;
        let dataAdmin_Account = await AdminAccount.findOne({ username: username_admin_account });
        //Get OTP in DB
        let OTP_DB = dataAdmin_Account.otp_code;

        if (otp_input !== OTP_DB) {
            res.status(404).json('Tokenisnotvalid');
        }

        res.status(200).json('Tokenistrue');
    },

    //ChangePassword (3)
    changePasswordAdmin: async (req, res) => {
        let email_otp = req.body.email_otp;
        let new_password = req.body.new_password;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(new_password, salt);

        //Get Data from Admin DB
        let dataAdmin = await Admin.findOne({ email: email_otp });

        //Update New Password When user input new password
        if (dataAdmin) {
            await AdminAccount.updateOne({ username: dataAdmin.username }, { otp_code: 'null' })
            await AdminAccount.updateOne({ username: dataAdmin.username }, { password: hashed }).then((data) => {
                res.status(200).json('Successful Change Password !')

            }).catch((e) => {
                res.status(504).json('Change Password Fail !')

            })
        }

    },



}

module.exports = driverAccountController;