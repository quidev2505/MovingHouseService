const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Customer = require("../models/Customer");
const RatingDriver = require("../models/RatingDriver")
const RatingService = require("../models/RatingService")
const Driver = require("../models/Driver")
const fs = require('fs');


const orderController = {
    //Create Order
    createOrder: async (req, res) => {
        try {

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
                res.status(201).json(dataUpdateOne);
            } else {
                res.status(501).json('update fail');

            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Update one field Order Detail
    updateOneFieldOrderDetail: async (req, res) => {
        try {

            const id_order_detail = req.params.id_order_detail;
            const dataUpdateOne = await OrderDetail.updateOne({ _id: id_order_detail }, req.body, { new: true });
            if (dataUpdateOne) {
                res.status(201).json(dataUpdateOne);
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
    },

    //Đánh giá dịch vụ và tài xế
    ratingOrder: async (req, res) => {
        try {
            //Xử lý giờ
            //Calculate Time at the moment
            const now = new Date();
            const vietnamTime = now.toLocaleString('vi-VN');
            const date_now = vietnamTime.split(' ')[0];
            const time_now = vietnamTime.split(' ')[1];

            //Đánh giá dịch vụ trước
            const order_id_input = req.params.order_id;

            const create_ratingService = await new RatingService({
                customer_name: req.body.customer_name,
                order_id: order_id_input,
                star: req.body.star_service,
                comment: req.body.comment_service,
                service_name: req.body.service_name,
                rating_date: date_now + time_now
            })

            //Lưu đánh giá dịch vụ
            const save_rating_service = await create_ratingService.save();

            //Tiếp theo tới đánh giá tài xế
            if (save_rating_service) {
                //Check xem có bao nhiêu tài xế trong đơn hàng
                const driver_name = req.body.driver_name
                const create_ratingDriver = await new RatingDriver({
                    rating_date: date_now + time_now,
                    // star: req.body.star_driver,
                    // comment: req.body.comment_driver,
                    customer_name: req.body.customer_name,
                })

                //Nếu có từ 2 tài xế trở lên
                if (driver_name.length > 1) {
                    driver_name.forEach(async (item, index) => {
                        //Lưu vào bảng đánh giá tài xế
                        create_ratingDriver.driver_name = item;
                        create_ratingDriver.star = req.body.star[index]
                        create_ratingDriver.comment = req.body.comment[index]
                        const saveRatingDriver = await create_ratingDriver.save();
                    })
                }

                //Nếu chỉ có 1 tài xế
                //Lưu vào bảng đánh giá tài xế
                create_ratingDriver.driver_name = driver_name[0]
                create_ratingDriver.comment = req.body.comment_driver[0]
                create_ratingDriver.star = req.body.star[0]
                const save_rating_driver = await create_ratingDriver.save();


                if (save_rating_driver) {
                    //Lưu vào cơ sở dữ liệu của bảng tài xế
                    if (driver_name.length > 1) {
                        driver_name.forEach(async (item, index) => {
                            const dataDriver = await Driver.findOne({ fullname: item });
                            const arr_rating_id_driver = dataDriver.id_rating;
                            arr_rating_id_driver.push(save_rating_driver._id)

                            //Cập nhật sao trung bình cho tài xế
                            let data_rating_driver = await RatingDriver.find({ driver_name: item })
                            let avg_star = 0;
                            let arr_star = data_rating_driver.map((item, index) => {
                                return item.star
                            })

                            avg_star = arr_star.reduce((a, b) => a + b, 0) / arr_star.length;


                            await Driver.updateOne({ fullname: item }, { id_raing: arr_rating_id_driver, star_average: avg_star }, { new: true })
                        })
                    } else {
                        const dataDriver = await Driver.findOne({ fullname: driver_name[0] });
                        const arr_rating_id_driver = dataDriver.id_rating;
                        arr_rating_id_driver.push(save_rating_driver._id)

                        //Cập nhật sao trung bình cho tài xế
                        let data_rating_driver = await RatingDriver.find({ driver_name: driver_name[0] })
                        let avg_star = 0;
                        let arr_star = data_rating_driver.map((item, index) => {
                            return item.star
                        })

                        avg_star = arr_star.reduce((a, b) => a + b, 0) / arr_star.length;


                        await Driver.updateOne({ fullname: item }, { id_raing: arr_rating_id_driver, start_average: avg_star }, { new: true })
                    }
                }

                res.status(201).json("Success")
            }

        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    }


}

module.exports = orderController;