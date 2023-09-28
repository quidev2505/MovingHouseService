const AdminAccount = require('../models/AdminAccount');
const bcrypt = require('bcrypt');

const adminController = {
    //Login
    loginAdmin: async (req, res) => {
        try {
            const admin_account = await AdminAccount.findOne({ username: req.body.username });

            //Compare password
            const validPassword = await bcrypt.compare(
                req.body.password,
                admin_account.password
            )

            if (!validPassword) {
                return res.status(404).json("Wrong password !")
            }else{
                if(admin_account.status_account === false){
                    return res.status(404).json("Ban Account")
                }
            }

            


            //Khi đăng nhập thành công
            const { password, ...others } = admin_account._doc;
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
    }



}

module.exports = adminController;