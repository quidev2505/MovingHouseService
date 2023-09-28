const User = require('../models/User');

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
    }
}

module.exports = userController;