const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let arrayRefreshToken = []

const authControllers = {
    //Register
    registerUser: async (req, res) => {
        try {
            //Check Duplicated Account
            let checkDuplicated = await User.findOne({ email: req.body.email });
            if(checkDuplicated){
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
            res.status(200).json(user);
        } catch (err) {
            console.log(req.body)
            res.status(500).json(err);
        }
    },

    //GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                role: user.role
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
            role: user.role,
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
            const user = await User.findOne({ email: req.body.email })

            if (!user) {
                return res.status(404).json("Wrong Email !");
            }

            //Compare password
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )

            if (!validPassword) {
                return res.status(404).json("Wrong password !")
            }

            if (user && validPassword) {
                //Tạo Access Token
                const accessToken = authControllers.generateAccessToken(user);

                //Tạo Refresh Token
                const refreshToken = authControllers.generateRefreshToken(user);

                arrayRefreshToken.push(refreshToken)
                console.log('mang luc moi dang nhap', arrayRefreshToken)

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
    }
}

module.exports = authControllers;