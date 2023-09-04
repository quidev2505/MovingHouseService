const Admin = require('../models/Admin');

const adminController = {
    //Login
    loginAdmin: async (req, res) => {
        try {
            const admin_account = await Admin.findOne({ username: req.body.username });

            if (!admin_account) {
                return res.status(403).json('Wrong username');
            }

            const password_input = req.body.password;
            if (password_input === admin_account.password) {
                const { password, ...others } = admin_account._doc;
                return res.status(200).json(others)
            }else{
                return res.status(404).json('Wrong password');
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json(err);
        }
    },


    //Change Password
    changePasswrod: async(req, res) => {
        try{
            const id_input = req.params.id; //Get ID admin-account want to change
     
            const data_old = await Admin.findOne({_id: id_input});
            
            // console.log(data_old.password)
            // console.log(req.body.password_current);


            if(data_old.password !== req.body.password_current){
                return res.status(400).json('Wrong Password !');
            }

            const data_new = await Admin.findByIdAndUpdate(id_input, {password: req.body.password_new});


            if(data_new){
                res.status(200).json('Success change password')
            }

        }catch(e){
            res.status(505).json(e);
        }
    }



}

module.exports = adminController;