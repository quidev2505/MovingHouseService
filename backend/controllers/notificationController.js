const Notification = require('../models/Notification');

const notiticationController = {
    //Create Notification
    createNotification: async (req, res) => {
        try {
            const data_input = req.body;

            const data_notification = await new Notification({
                order_id: data_input.order_id,
                status_order: data_input.status_order
            })

            //Save Data Notificatiooon
            const data_notification_save = await data_notification.save();

            if (data_notification_save) {
                res.status(201).json('Success !')
            } else {
                res.status(401).json('Error !')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //Show notification
    showNotification: async (req, res) => {
        try {
            const data_get = await Notification.find().sort({ createdAt: -1 })
            if (data_get) {
                res.status(201).json(data_get)
            } else {
                res.status(401).json('Fail')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //Show thông báo với từng khách hàng
    showNotificationWithIdCustomer: async (req, res) => {
        try {

            const data_get = await Notification.find({ id_customer: req.params.id_customer }).sort({ createdAt: -1 })

            if (data_get) {
                res.status(201).json(data_get)
            } else {
                res.status(401).json('Fail')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Xóa thông báo
    deleteNotify: async (req, res) => {
        try {
            const id_notify = req.params.id;
            const check = await Notification.findByIdAndDelete({ _id: id_notify })
            if (check) {
                res.status(201).json('Delete Success')
            } else {
                res.status(501).json('Delete Fail')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e);
        }
    },
    //update Item 
    updateItem: async (req, res) => {
        try {
            const id = req.params.id;

            // Lấy thông tin về file được upload
            const file = req.file;

            if (file) {
                req.body.image = file.path

                //Thực hiện xóa ảnh cũ
                const imagePath = `${req.body.image_old}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } else {
                req.body.image = req.body.imgURL || req.body.image
            }

            const check_update = await Item.findByIdAndUpdate(id, req.body);
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
    //Read Item -> Show Item
    readItem: async (req, res) => {
        try {
            const data_from_db = await Item.find()

            if (data_from_db) {
                res.status(201).json(data_from_db)
            } else {
                res.status(501).json('Error');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //View Detail Item with ID
    viewDetailItem: async (req, res) => {
        try {
            const id_item = req.params.id;
            const data_detail_item = await Item.findOne({ _id: id_item })
            if (data_detail_item) {
                res.status(201).json(data_detail_item);
            } else {
                res.status(501).json('Get fail');

            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //View Detail Blog with Title
    viewDetailBlogWithTitle: async (req, res) => {
        try {
            const title_blog = req.params.title;

            const data_detail_blog = await Blog.findOne({ title: title_blog })

            if (data_detail_blog) {
                res.status(201).json(data_detail_blog);
            } else {
                res.status(501).json('Get fail');

            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Update one field item
    updateOneFieldItem: async (req, res) => {
        try {
            const id_item = req.params.id;
            const dataUpdateOne = await Item.updateOne({ _id: id_item }, req.body, { new: true });
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
    //Get Size with name
    getSizeWithName: async (req, res) => {
        try {
            const name_item = req.params.name;
            const data_get = await Item.findOne({ name: name_item });
            if (data_get) {
                res.status(201).json(data_get.size)
            } else {
                res.status(501).json('fail')
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Delete Item
    deleteItem: async (req, res) => {
        try {
            const id = req.params.id;
            const data_item = await Item.findOne({ _id: id })

            const check_delete = await Item.findByIdAndDelete({ _id: id });


            if (check_delete) {
                //Thực hiện xóa ảnh cũ
                const imagePath = `${data_item.image}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                res.status(201).json('Delete Success !')
            } else {
                res.status(501).json('Error');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    }


}

module.exports = notiticationController;