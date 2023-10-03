const Item = require('../models/Item');
const fs = require('fs');

const itemController = {
    //Create Item
    createItem: async (req, res) => {
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

            const data_item = await new Item({
                name: data_input.name,
                image: IMG,
                category: data_input.category,
                size: data_input.size
            })


            console.log(data_item)

            //Save Data Item
            const data_save = await data_item.save();

            if (data_save) {
                res.status(200).json(data_save)
            } else {
                res.status(401).json('Error')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
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

module.exports = itemController;