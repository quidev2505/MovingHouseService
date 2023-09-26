const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Customer = require("../models/Customer");
const fs = require('fs');


const orderController = {
    //Create Order
    createOrder: async (req, res) => {
        try {
            const data_input = req.body;

            // Tạo chuỗi chứa 8 ký tự số ngẫu nhiên
            let code_order_id = "";
            for (let i = 0; i < 8; i++) {
                code_order_id += String(Math.floor(Math.random() * 10));
            }


            //Calculate Time at the moment
            const now = new Date();
            const vietnamTime = now.toLocaleString('vi-VN');
            const date_now = vietnamTime.split(' ')[0];
            const time_now = vietnamTime.split(' ')[1];

            let payment_status = ''
            if (req.body.payment_method === "Thanh toán VNPAY") {
                payment_status = 'Đã thanh toán'
            } else {
                payment_status = 'Chưa thanh toán'
            }

            const data_order_detail = await new OrderDetail({
                distance: req.body.distance,
                duration: req.body.duration,
                fromLocation_detail: req.body.fromLocation_detail,
                toLocation_detail: req.body.toLocation_detail,
                man_power_quantity: req.body.man_power_quantity,
                vehicle_price: req.body.price_vehicle,
                man_power_price: req.body.man_power_price,
                moving_fee: req.body.moving_fee,
                service_fee: req.body.service_fee,
                item_detail: req.body.item_detail,
                payment_method: req.body.payment_method,
                note_driver: req.body.note_driver,
                payment_status: payment_status,
                totalOrder: req.body.totalOrder,
            })

            //Save Order Detail
            const data_save_order_detail = await data_order_detail.save();

            if (data_save_order_detail) {
                const data_order = await new Order({
                    order_id: code_order_id,
                    customer_id: req.body.customer_id,
                    date_created: date_now + time_now,//Ngày + giờ tạo đơn hàng
                    service_name: req.body.service_name,
                    date_start: req.body.date_start,
                    time_start: req.body.time_start,
                    fromLocation: req.body.fromLocation,
                    toLocation: req.body.toLocation,
                    vehicle_name: req.body.vehicle_name,
                    totalOrder: req.body.totalOrder,
                    order_detail_id: data_save_order_detail._id,
                })


                if (data_order) {
                    //Save Order Detail
                    const data_save_order = await data_order.save();
                    if (data_save_order) {
                        res.status(200).json(data_order)
                    } else {
                        res.status(401).json('Error')
                    }
                } else {
                    res.status(401).json('Error')
                }
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //View All Order
    viewAllOrder: async (req, res) => {
        try {
            const data_all_order = await Order.find();

            if (data_all_order) {
                data_all_order.forEach(async(item, index) => {
                    console.log(item.customer_id._id)
                   
                    // let result = await Customer.findOne({_id: item.customer_id});
                    // console.log(result)
                })

            }

            if (data_all_order) {
                res.status(201).json(data_all_order)
            } else {
                res.status(501).json(e)
            }
        } catch (e) {
            res.status(501).json(e)
        }
    },

    //View Order With Id_Customer
    viewOrderWithIdCustomer: async (req, res) => {
        try {
            const customer_id = req.params.id_customer;

            const data_order = await Order.find({ customer_id: customer_id });



            if (data_order) {
                res.status(201).json(data_order)
            } else {
                res.status(501).json(e)
            }
        } catch (e) {
            res.status(501).json(e)
        }
    },
    //View Order Detail With Order detail id
    viewOrderWithOrderDetailId: async (req, res) => {
        try {
            const order_detail_id = req.params.order_detail_id;

            const data_order_detail = await OrderDetail.find({ _id: order_detail_id });

            if (data_order_detail) {
                res.status(201).json(data_order_detail)
            } else {
                res.status(501).json(e)
            }
        } catch (e) {
            res.status(501).json(e)
        }
    },
    //update Blog 
    updateBlog: async (req, res) => {
        try {
            const id = req.params.id;

            // Lấy thông tin về file được upload
            const file = req.file;

            if (file) {
                req.body.thumbnail = file.path

                //Thực hiện xóa ảnh cũ
                const imagePath = `${req.body.image_old}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }

            }

            const check_update = await Blog.findByIdAndUpdate(id, req.body);
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
    //Read Blog -> Show Blog
    readBlog: async (req, res) => {
        try {
            const data_from_db = await Blog.find().sort({
                post_date: -1
            })



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

    //View Detail Blog with ID
    viewDetailBlog: async (req, res) => {
        try {
            const id_blog = req.params.id;
            const data_detail_blog = await Blog.findOne({ _id: id_blog })
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

    //Update one field Order
    updateOneFieldOrder: async (req, res) => {
        try {
            const id_order = req.params.id_order;
            const dataUpdateOne = await Order.updateOne({ order_id: id_order }, req.body, { new: true });
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

    //Delete Blog
    deleteBlog: async (req, res) => {
        try {
            const id = req.params.id;
            const data_blog = await Blog.findOne({ _id: id })

            const check_delete = await Blog.findByIdAndDelete({ _id: id });


            if (check_delete) {
                //Thực hiện xóa ảnh cũ
                const imagePath = `${data_blog.thumbnail}`;
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

module.exports = orderController;