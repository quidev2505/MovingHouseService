const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Customer = require("../models/Customer");
const RatingDriver = require("../models/RatingDriver")
const RatingService = require("../models/RatingService")
const Driver = require("../models/Driver")
const Notification = require('../models/Notification');
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
                    deliveryArea: req.body.deliveryArea,
                    fromLocation: req.body.fromLocation,
                    toLocation: req.body.toLocation,
                    vehicle_name: req.body.vehicle_name,
                    totalOrder: req.body.totalOrder,
                    order_detail_id: data_save_order_detail._id,
                })

                const data_notification = await new Notification({
                    order_id: code_order_id,
                    id_customer: req.body.customer_id
                })

                //Save Data Notificatiooon
                const data_notification_save = await data_notification.save();

                if (data_order && data_notification_save) {
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
    //View DeliveryArea
    viewDeliveryArea: async (req, res) => {
        try {
            const data_all_order = await Order.find({status: "Đã hoàn thành"});
            if (data_all_order) {
                res.status(201).json(data_all_order)
            } else {
                res.status(501).json(e)
            }
        } catch (e) {
            res.status(501).json(e)
        }
    },
    //View Order With Order id
    ViewOrderWithOrderId: async (req, res) => {
        try {
            const order_id_input = req.params.order_id;

            const data_order = await Order.findOne({ order_id: order_id_input });
            if (data_order) {
                res.status(201).json(data_order)
            } else {
                res.status(501).json(e)
            }
        } catch (e) {
            res.status(501).json(e)
        }
    },
    isDateInRange: (date, startDate, endDate) => {
        // Lấy ngày, tháng, năm của ngày cần kiểm tra
        const [day, month, year] = date.split("/");

        // Lấy ngày, tháng, năm của ngày bắt đầu và ngày kết thúc
        const [startDay, startMonth, startYear] = startDate.split("/");
        const [endDay, endMonth, endYear] = endDate.split("/");

        // console.log(date)
        // console.log(startDate)
        // console.log(endDate)

        //Trường hợp chỉ đưa về 1 giá trị đúng và các trường hợp còn lại sai hết



        // So sánh ngày, tháng, năm của ngày cần kiểm tra với ngày bắt đầu và ngày kết thúc
        if (day >= startDay && day <= endDay) {
            // Nếu ngày cần kiểm tra lớn hơn hoặc bằng ngày bắt đầu
            if (month >= startMonth || (month === startMonth && day >= startDay)) {
                // Nếu tháng cần kiểm tra lớn hơn hoặc bằng tháng bắt đầu, hoặc tháng bằng tháng bắt đầu và ngày cần kiểm tra lớn hơn hoặc bằng ngày bắt đầu
                if (month <= endMonth || (month === endMonth && day <= endDay)) {
                    // Nếu tháng cần kiểm tra nhỏ hơn hoặc bằng tháng kết thúc, hoặc tháng bằng tháng kết thúc và ngày cần kiểm tra nhỏ hơn hoặc bằng ngày kết thúc
                    if (year <= endYear && year >= startYear) {
                        // Nếu năm cần kiểm tra nằm trong khoảng năm của ngày bắt đầu và ngày kết thúc
                        return true;
                    }
                }
            } else {
                // Nếu tháng cần kiểm tra nhỏ hơn tháng bắt đầu
                return false;
            }
        } else {
            //Nếu ngày bắt đầu và ngày kết thúc đều nhỏ hơn ngày hiện tại và tháng bắng nhau
            if (day > startDay && day > endDay && month == startMonth && month == endMonth) {
                return false
            }

            //Nếu tháng bằng nhau
            if (day < startDay && month == startMonth) {
                return false
            } else {
                // Nếu ngày cần kiểm tra nhỏ hơn ngày bắt đầu
                if (month >= startMonth && month <= endMonth) {
                    // Nếu tháng cần kiểm tra lớn hơn tháng bắt đầu
                    return true;
                } else {
                    // Nếu tháng cần kiểm tra nhỏ hơn hoặc bằng tháng bắt đầu
                    return false;
                }
            }

        }

        return false;
    },
    //Tìm thông tin đơn hàng với siêu filter
    findOrder: async (req, res) => {
        try {
            const dataGet = req.body;

            //So sánh với các filter sau
            //Dữ liệu ban đầu
            let arr_init = []
            const data_need = dataGet.dataOrder

            for (let i = 0; i < data_need.length; i++) {
                let item = data_need[i];
                //Lọc theo cả 2 loại
                if (dataGet.startRange != '' && dataGet.endRange != '' && dataGet.endRangePrice != 0 && dataGet.startRangePrice != 0) {
                    orderController.isDateInRange(item.date_start, dataGet.startRange, dataGet.endRange) && Number(dataGet.startRangePrice) <= item.totalOrder && item.totalOrder <= Number(dataGet.endRangePrice) ? arr_init.push(item)
                        : ''
                }
                //Lọc theo thời gian
                else if (dataGet.startRange != '' && dataGet.endRange != '') {
                    orderController.isDateInRange(item.date_start, dataGet.startRange, dataGet.endRange) ?
                        arr_init.push(item) : ''
                }
                //Lọc theo tổng đơn hàng
                else if (dataGet.endRangePrice != 0 && dataGet.startRangePrice != 0) {
                    Number(dataGet.startRangePrice) <= item.totalOrder && item.totalOrder <= Number(dataGet.endRangePrice) ? arr_init.push(item) : ''
                }
                //Khi mà không có lọc theo giá và không lọc theo khung thời gian 
                else {
                    arr_init.push(item)
                }

            }

            // console.log(arr_init)
            // console.log('Kết thúc nè')

            // console.log(arr_init)
            res.status(201).json(arr_init)
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //Tìm thông tin đơn hàng với siêu filter (Phía Admin)
    findOrderAdmin: async (req, res) => {
        try {
            const dataGet = req.body;
            //So sánh với các filter sau
            //Dữ liệu ban đầu
            let arr_init = []
            dataGet.dataOrder.forEach((item, index) => {
                if (dataGet.status_input === item.status) {
                    //Lọc theo cả 2 loại
                    if (dataGet.startRange !== '' && dataGet.endRange !== '' && dataGet.endRangePrice !== 0 && dataGet.startRangePrice !== 0) {
                        dataGet.startRange <= item.date_start && item.date_start <= dataGet.endRange && Number(dataGet.startRangePrice) <= item.totalOrder && item.totalOrder <= Number(dataGet.endRangePrice) ? arr_init.push(item)
                            : ''
                    }
                    //Lọc theo thời gian
                    else if (dataGet.startRange !== '' && dataGet.endRange !== '') {
                        dataGet.startRange <= item.date_start && item.date_start <= dataGet.endRange ?
                            arr_init.push(item) : ''
                    }
                    //Lọc theo tổng đơn hàng
                    else if (dataGet.endRangePrice !== 0 && dataGet.startRangePrice !== 0) {
                        Number(dataGet.startRangePrice) <= item.totalOrder && item.totalOrder <= Number(dataGet.endRangePrice) ? arr_init.push(item) : ''
                    }
                }

            })

            res.status(201).json(arr_init)
        } catch (e) {
            console.log(e)
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

                const ob_rating_driver = {
                    rating_date: date_now + time_now,
                    customer_name: req.body.customer_name,
                }


                //Nếu có từ 2 tài xế trở lên
                if (driver_name.length > 1) {
                    driver_name.forEach(async (item, index) => {
                        //Lưu vào bảng đánh giá tài xế
                        ob_rating_driver.driver_name = item;
                        ob_rating_driver.star = req.body.star_driver[index]
                        ob_rating_driver.comment = req.body.comment_driver[index]
                        const create_ratingDriver = await new RatingDriver(ob_rating_driver)
                        await create_ratingDriver.save()

                        const dataDriver = await Driver.findOne({ fullname: item });
                        const arr_rating_id_driver = dataDriver.id_rating;
                        arr_rating_id_driver.push(create_ratingDriver._id)

                        //Cập nhật sao trung bình cho tài xế
                        let data_rating_driver = await RatingDriver.find({ driver_name: item })
                        let sum = 0;
                        let arr_star = data_rating_driver.map((item, index) => {
                            return item.star
                        })

                        arr_star.forEach((item, index) => {
                            sum += item
                        })


                        console.log(arr_star)
                        avg_star = Math.floor(sum / arr_star.length);
                        console.log(avg_star)


                        await Driver.updateOne({ fullname: item }, { id_rating: arr_rating_id_driver, star_average: avg_star }, { new: true })

                    })
                } else {
                    //Nếu chỉ có 1 tài xế
                    //Lưu vào bảng đánh giá tài xế
                    ob_rating_driver.driver_name = driver_name[0]
                    ob_rating_driver.comment = req.body.comment_driver[0]
                    ob_rating_driver.star = req.body.star_driver[0]
                    // const save_rating_driver = await create_ratingDriver.save();
                    const create_ratingDriver = await new RatingDriver(ob_rating_driver)
                    await create_ratingDriver.save()

                    const dataDriver = await Driver.findOne({ fullname: driver_name[0] });
                    const arr_rating_id_driver = dataDriver.id_rating;
                    arr_rating_id_driver.push(create_ratingDriver._id)

                    //Cập nhật sao trung bình cho tài xế
                    let data_rating_driver = await RatingDriver.find({ driver_name: driver_name[0] })
                    let sum = 0;
                    let arr_star = data_rating_driver.map((item, index) => {
                        return item.star
                    })

                    arr_star.forEach((item, index) => {
                        sum += item
                    })

                    avg_star = Math.floor(sum / arr_star.length);

                    await Driver.updateOne({ fullname: driver_name[0] }, { id_rating: arr_rating_id_driver, star_average: avg_star }, { new: true })
                }



                res.status(201).json("Success")
            }

        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Lấy đánh giá đơn hàng ra
    getRatingOrder: async (req, res) => {
        const data_rating_service = await RatingService.find({ order_id: req.params.order_id })
        if (data_rating_service) {
            res.status(201).json(data_rating_service)
        } else {
            res.status(501).json('Error')
        }
    },

    //Lấy thông tin đơn hàng
    findDataOrder: async (req, res) => {
        try {
            const { order_id, typeFilter } = req.body;

            if (typeFilter == "Tất cả") {
                const api_call_order = await Order.find()

                //Lấy order detail id
                const arr_order_detail_id = await Promise.all(api_call_order.map(async (item, index) => {
                    const order_detail_id = item.order_detail_id;
                    const dataOrderDetail = await OrderDetail.findOne({ _id: order_detail_id });
                    return dataOrderDetail
                }))

                const arr_result = api_call_order.map((item, index) => {
                    const ob = {
                        order_id: item.order_id,
                        date_created: item.date_created,
                        service_name: item.service_name,
                        date_start: item.date_start,
                        date_end: item.date_end,
                        fromLocation: item.fromLocation,
                        toLocation: item.toLocation,
                        vehicle_name: item.vehicle_name,
                        driver_name: item.driver_name,
                        totalOrder: item.totalOrder,
                        status: item.status,
                        distance: arr_order_detail_id[index].distance,
                        duration: arr_order_detail_id[index].duration,
                        payment_status: arr_order_detail_id[index].payment_status
                    }
                    return ob;
                })

                if (arr_result) {
                    res.status(201).json(arr_result)
                } else {
                    res.status(501).json('Error');
                }
            } else {
                try {
                    const api_call_order = await Order.findOne({
                        order_id: order_id
                    })


                    //Lấy order detail id
                    const order_detailId = api_call_order.order_detail_id;

                    const arr_orderDetail = await OrderDetail.findOne({ _id: order_detailId })

                    const arr_new = []
                    const ob = {
                        order_id: api_call_order.order_id,
                        date_created: api_call_order.date_created,
                        service_name: api_call_order.service_name,
                        date_start: api_call_order.date_start,
                        date_end: api_call_order.date_end,
                        fromLocation: api_call_order.fromLocation,
                        toLocation: api_call_order.toLocation,
                        vehicle_name: api_call_order.vehicle_name,
                        driver_name: api_call_order.driver_name,
                        totalOrder: api_call_order.totalOrder,
                        status: api_call_order.status,
                        distance: arr_orderDetail.distance,
                        duration: arr_orderDetail.duration,
                        payment_status: arr_orderDetail.payment_status
                    }

                    arr_new.push(ob);

                    if (arr_new) {
                        res.status(201).json(arr_new)
                    } else {
                        res.status(501).json('Error');
                    }
                } catch (e) {
                    console.log(e)
                    res.status(501).json('Not Found');

                }

            }

        } catch (e) {
            console.log(e)
        }
    }


}

module.exports = orderController;