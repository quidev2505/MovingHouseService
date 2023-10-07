const User = require('../models/User');
const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const OTP = require('one-time-password')

let arrayRefreshToken = []

const authControllers = {
    //Register
    registerUser: async (req, res) => {
        try {
            //Check Duplicated Account
            let checkDuplicated = await User.findOne({ email: req.body.email });
            if (checkDuplicated) {
                return res.status(404).json("AlreadyUseEmail");
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new User({
                fullname: req.body.fullname,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                password: hashed
            });


            //Save to DB
            const user = await newUser.save();

            if (user) {
                //Create new Customer
                const avatar_API = `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.body.fullname}`

                const newCustomer = await new Customer({
                    fullname: req.body.fullname,
                    avatar: avatar_API
                })
                const customer = await newCustomer.save();
                res.status(200).json(customer);
            } else {
                res.status(500).json('loi');

            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },


    //GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_ACCESS_KEY,
            {
                expiresIn: "10d"
            }
        );
    },

    //GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
        },
            process.env.JWT_REFRESH_KEY,
            {
                expiresIn: "365d"
            }
        )
    },

    //Login
    loginUser: async (req, res) => {
        try {
            let user = await User.findOne({ email: req.body.email }) //Check xem đăng nhập với Email

            if (!user) {
                //Check xem đăng nhập với số điện thoại
                user = await User.findOne({ phonenumber: req.body.email })

            }

            //Compare password
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )

            if (!validPassword) {
                return res.status(404).json("Wrong password !")
            }
            else {
                if (user.status === false) {
                    return res.status(404).json("Ban Account")
                }
            }


            if (user && validPassword) {
                //Tạo Access Token
                const accessToken = authControllers.generateAccessToken(user);

                //Tạo Refresh Token
                const refreshToken = authControllers.generateRefreshToken(user);

                arrayRefreshToken.push(refreshToken)
                // console.log('mang luc moi dang nhap', arrayRefreshToken)

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })


                //Loại bỏ password ra để bảo mật
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },


    //Login with google
    loginWithGoogle: async (req, res) => {
        const user = req.body
        const email = user.email;
        const fullname = user.fullname;
        const id = user.id;

        console.log(req.body)
        try {
            //Tạo Access Token
            const accessToken = authControllers.generateAccessToken(user);

            //Tạo Refresh Token
            const refreshToken = authControllers.generateRefreshToken(user);

            arrayRefreshToken.push(refreshToken)
            // console.log('mang luc moi dang nhap', arrayRefreshToken)

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            })


            res.status(200).json({ email, fullname, id, accessToken });
        }
        catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    //Yêu cầu
    requestRefreshToken: async (req, res) => {
        //Take refresh token from user
        const refreshToken = await req.cookies.refreshToken;
        if (!refreshToken)
            return res.status(401).json("You are not authenticated");

        console.log('Mang luc yeu cau refresh token :', arrayRefreshToken)

        if (!arrayRefreshToken.includes(refreshToken)) {
            return res.status(401).json("Refresh token is not valid");
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err)
            }

            arrayRefreshToken = arrayRefreshToken.filter((token) => token !== refreshToken);

            //Tạo Access Token và Refresh Token
            const newAccessToken = authControllers.generateAccessToken(user);
            const newRefreshToken = authControllers.generateRefreshToken(user);
            arrayRefreshToken.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            })

            res.status(200).json({ accessToken: newAccessToken })
        })
    },

    //Log out
    userLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        arrayRefreshToken = await arrayRefreshToken.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Loged out !");
    },

    //Verify Token OTP (2)
    verifyOTP: async (req, res) => {
        let email_otp = req.body.email_input;
        let otp_input = req.body.otp_input;

        //Get Data from User DB
        let dataUser = await User.findOne({ email: email_otp });
        //Get OTP in DB
        let OTP_DB = dataUser.otp_code;

        if (otp_input !== OTP_DB) {
            res.status(404).json('Tokenisnotvalid');
        }

        res.status(200).json('Tokenistrue');
    },


    //ChangePassword (3)
    changePassword: async (req, res) => {
        let email_otp = req.body.email_otp;
        let new_password = req.body.new_password;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(new_password, salt);

        //Get Data from User DB
        let dataUser = await User.findOne({ email: email_otp });

        //Update New Password When user input new password
        if (dataUser) {
            await User.findByIdAndUpdate(dataUser._id, { otp_code: 'null' })
            await User.findByIdAndUpdate(dataUser._id, { password: hashed }).then((data) => {
                res.status(200).json('Successful Change Password !')

            }).catch((e) => {
                res.status(504).json('Change Password Fail !')

            })
        }

    },

    //Forgot password (1)
    forgotPassword: async (req, res) => {
        let email_otp = req.body.email_input;

        //Get _id from User DB
        let get_id = await User.findOne({ email: email_otp });

        //Generator OTP
        // A base32-encoded key.
        const dummyKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

        // Derive a 6-digit, time-based token from 'dummyKey'.
        const token = OTP.generate(dummyKey);

        //Update OTP into DB User
        if (get_id) {
            await User.findByIdAndUpdate(get_id._id, { otp_code: token });
        }

        //Check Email is already register
        let checkExistEmailRegister = await User.findOne({ email: email_otp });
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
    }
}

module.exports = authControllers;