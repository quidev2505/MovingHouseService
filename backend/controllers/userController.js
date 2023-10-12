const User = require('../models/User');
const bcrypt = require('bcrypt');
const userController = {
    //Get_all_user
    get_all_user: async (req, res) => {
        try{
            const user = await User.find();
            res.status(200).json(user);
        }catch(e){
            res.status(500).json(e);
        }
    },
    //Lock account Customer
    lockAccountCustomer: async(req, res) => {
        try{
            const id_user = req.params.id;
            const check = await User.updateOne({ _id: id_user }, req.body, { new: true })
            if(check){
                res.status(200).json('success')
            }else{
                res.status(500).json('error');
            }
        }catch(e){
            res.status(500).json(e)
        }
    },
    //GET ALL USERS
    getAllUsers: async(req, res)=>{
        try{
            const user = await User.find();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },
    
    //DELETE USER
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete successfully !");
        } catch (err) {
            res.status(500).json(err);
        }
    },


    //ChangePassword User
    changePassword: async (req, res) => {
        try {
            const id_input = req.params.id; //Get ID user-account want to change

            const data_old = await User.findOne({ _id: id_input });


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

            const data_new = await User.findByIdAndUpdate(id_input, { password: hashed });


            if (data_new) {
                res.status(200).json('Success update password')
            } else {
                res.status(505).json('Fail to update password !');
            }

        } catch (e) {
            res.status(505).json(e);
        }
    },

}

module.exports = userController;