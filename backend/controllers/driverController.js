const Driver = require('../models/Driver');
const DriverAccount = require('../models/DriverAccount')
const Order = require('../models/Order')
const OrderDetail = require('../models/OrderDetail')
const fs = require('fs');
const bcrypt = require('bcrypt');

const driverController = {
    //Create Driver
    createDriver: async (req, res) => {
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

            //Mã hóa mật khẩu 
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(data_input.password, salt);


            const data_driver = await new Driver({
                profile_code: data_input.profile_code,
                username: data_input.username,
                gender: data_input.gender,
                citizen_id: data_input.citizen_id,
                phonenumber: data_input.phonenumber,
                fullname: data_input.fullname,
                date_of_birth: data_input.date_of_birth,
                email: data_input.email,
                address: data_input.address,
                vehicle_type: data_input.vehicle_type,
                license_plate: data_input.license_plate,
                location_delivery: data_input.location_delivery,
                avatar: IMG,
                current_position: data_input.address
            })

            //Save Data Driver
            const data_driver_save = await data_driver.save();

            if (data_driver_save) {
                const data_driver_account = await new DriverAccount({
                    username: data_input.username,
                    password: hashed
                })

                //Save Data Driver Account
                const data_driver_account_save = await data_driver_account.save();

                if (data_driver_account_save) {
                    res.status(200).json('Create Driver Success')
                } else {
                    res.status(401).json('Error')
                }
            } else {
                res.status(401).json('Error')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //Get Info Driver
    getAllDriver: async (req, res) => {
        try {
            const data_driver = await Driver.find();

            if (data_driver) {
                res.status(200).json(data_driver)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },

    //Get Info Driver Detail with ID
    getDriverWithID: async (req, res) => {
        try {
            const id_driver = req.params.id;

            const data_driver = await Driver.findOne({ _id: id_driver });



            if (data_driver) {
                res.status(200).json(data_driver)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Lấy mảng thông tin tài xế
    getArrDriverInfo: async (req, res) => {
        try {
            const arr_name_driver = req.body;
            console.log(arr_name_driver)

            if (arr_name_driver.length === 0) {
                return res.status(404).json({
                    message: 'Không có tài xế nào để tìm kiếm',
                });
            }

            const arr_data_driver = await Promise.all(arr_name_driver.map(async (item) => {
                const data_get = await Driver.findOne({ fullname: item });
                const ob = {
                    avatar: data_get.avatar,
                    fullname: data_get.fullname,
                    phonenumber: data_get.phonenumber
                };
                return ob;
            }));

            res.status(201).json(arr_data_driver);
        } catch (e) {
            console.log(e)
            res.status(500).json(e);
        }
    },
    //Get Info Driver Detail with Username
    getDriverWithUsername: async (req, res) => {
        try {
            const username_driver = req.params.username;

            const data_driver = await Driver.findOne({ username: username_driver });

            if (data_driver) {
                res.status(200).json(data_driver)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Update Customer
    updateCustomer: async (req, res) => {
        try {
            // Lấy thông tin về file được upload
            const file = req.file;
            const data_object = req.body;

            let Customer_update = {}

            if (file) {
                Customer_update = {
                    fullname: data_object.fullname,
                    address: data_object.address,
                    avatar: file.path,
                    gender: data_object.gender,
                }
                //Thực hiện xóa ảnh cũ
                const imagePath = `${req.body.image_old}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } else {
                Customer_update = {
                    fullname: data_object.fullname,
                    address: data_object.address,
                    gender: data_object.gender,
                }
            }




            if (Customer_update) {
                const data_update_customer = await Customer.findByIdAndUpdate({ _id: data_object.id_customer }, Customer_update);
                if (data_update_customer) {
                    const user_update = {
                        fullname: data_object.fullname,
                        email: data_object.email,
                        phonenumber: data_object.phonenumber
                    }
                    const data_update_user = await User.findByIdAndUpdate({ _id: data_object.id_user }, user_update);
                    if (data_update_user) {
                        res.status(202).json(data_update_user);
                    } else {
                        res.status(502).json("update Fail");

                    }
                }
            }
        } catch (e) {
            console.log(e)
            res.status(501).json("update Fail");

        }
    },

    //Update one field Driver(Status Driver)
    updateOneFieldDriver: async (req, res) => {
        try {
            const id_driver = req.params.id;

            const dataUpdateOne = await Driver.updateOne({ _id: id_driver }, req.body, { new: true });
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

    //Update one field Driver With fullname(Status Driver)
    updateOneFieldDriverWithFullName: async (req, res) => {
        try {
            const fullname_driver = req.params.fullname;

            const dataUpdateOne = await Driver.updateOne({ fullname: fullname_driver }, req.body, { new: true });
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

    //Lock Driver Account
    lockDriverAccount: async (req, res) => {
        try {
            const username_driver = req.params.username;

            const dataUpdateOne = await DriverAccount.updateOne({ username: username_driver }, req.body, { new: true });
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

    //Get Driver Account
    getdriverAccount: async (req, res) => {
        try {
            const username_driver = req.params.username;

            const data_driver_account = await DriverAccount.findOne({ username: username_driver })
            if (data_driver_account) {
                res.status(201).json(data_driver_account);
            } else {
                res.status(501).json('update fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },


    //Get Driver With Fullname
    getdriverWithFullname: async (req, res) => {
        try {

            const fullname_driver = req.params.fullname;
            console.log(fullname_driver)

            const data_driver = await Driver.findOne({ fullname: fullname_driver })
            if (data_driver) {
                res.status(201).json(data_driver);
            } else {
                res.status(501).json('Get fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },


    //Get All Driver Account
    getall_driverAccount: async (req, res) => {
        try {
            const data_driver_account = await DriverAccount.find()
            if (data_driver_account) {
                res.status(201).json(data_driver_account);
            } else {
                res.status(501).json('update fail');
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },


    //update Driver
    updateDriver: async (req, res) => {
        try {
            const id = req.params.id;

            // Lấy thông tin về file được upload
            const file = req.file;

            if (file) {
                req.body.avatar = file.path

                //Thực hiện xóa ảnh cũ
                const imagePath = `${req.body.img_old}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } else {
                req.body.avatar = req.body.imgURL || req.body.avatar
            }

            const check_update = await Driver.findByIdAndUpdate(id, req.body);
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
    //Loại bỏ kí tự có dấu
    removeVietnameseTones: (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(
            /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            " "
        );
        return str;
    },
    //Tìm kiếm tài xế
    findDriverAdvaned: async (req, res) => {
        try {
            const { profile_code, phonenumber, fullname, address } = req.body;

            //Gọi dữ liệu Driver
            const call_api_driver = await Driver.find();
            const data_driver = call_api_driver;


            const data_all = data_driver.map((item, index) => {
                return {
                    profile_code: item.profile_code,//
                    gender: item.gender,//
                    fullname: item.fullname,//
                    email: item.email,//
                    phonenumber: item.phonenumber,//
                    date_of_birth: item.date_of_birth,//
                    address: item.address,//
                    vehicle_type: item.vehicle_type,//
                    location_delivery: item.location_delivery,//
                    avatar: item.avatar,//
                    id_rating: item.id_rating,//
                    id_delivery: item.id_delivery,//
                    citizen_id: item.citizen_id,//
                    star_average: item.star_average,//
                    status: item.status,//
                    current_position: item.current_position,//
                    license_plate: item.license_plate
                }
            })


            //Khu vực xử lý dữ liệu nhập vào
            let new_arr = data_all.filter((item) => {
                // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
                let word_Change_VN = driverController.removeVietnameseTones(fullname != '' ? item.fullname : phonenumber != '' ? item.phonenumber : address != '' ? item?.address : profile_code != '' ? item.profile_code : '');
                let word_search = driverController.removeVietnameseTones(fullname || phonenumber || address || profile_code);
                // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
                let search = fullname || phonenumber || address || profile_code

                return search.toLowerCase() === ""
                    ? item
                    : word_Change_VN.toLowerCase().includes(word_search.toLowerCase());
            });

            // //Dùng vòng lặp lướt qua các đơn hàng đã thanh toán
            // var arr_final = [] //Kết quả hiển thị
            // new_arr.forEach(async (item, index) => {
            //     //Khu vực cho thanh toán
            //     const dataOrder = await Order.find({ customer_id: item.customer_id })

            //     let sumPayment = 0;//Tổng thanh toán
            //     let sumOrderComplete = 0;//Số đơn giao thành công
            //     let sumOrderCancel = 0;//Số đơn đã hủy

            //     dataOrder.forEach((item1, indx) => {
            //         //Tổng thanh toán
            //         if (item1.status === "Đã hoàn thành") {
            //             sumOrderComplete++;
            //             sumPayment += item1.totalOrder
            //         } else if (item1.status === "Đã hủy") {
            //             sumOrderCancel++;
            //         }
            //     })

            //     item.totalPayment = sumPayment
            //     item.totalOrderComplete = sumOrderComplete;
            //     item.totalOrderCancel = sumOrderCancel;

            //     //Khu vực cho bình luận
            //     const dataCommentBlog = await CommentBlog.find({ fullname: item.fullname })
            //     let sumCommentBlog = 0;//Tổng số lượt bình luận

            //     dataCommentBlog.forEach((item, index) => {
            //         sumCommentBlog++;
            //     })

            //     item.totalCommentBlog = sumCommentBlog


            //     arr_final.push(item)
            // })

            setTimeout(() => {
                if (new_arr) {
                    res.status(201).json(new_arr);
                } else {
                    res.status(501).json('Error');
                }
            }, 700);


        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Thông tin thêm cho tài xế
    findMoreDriverInfo: async (req, res) => {
        try {
            //Đầu tiên gọi ra mảng id_delivery lấy tất cả order_id mà tài xế đã giao
            const data_call_driver = await Driver.find()

            var arr_total_distance = [];
            //Thực hiện tính tổng thời gian vận chuyển và tổng quãng đường vận chuyển
            for (let i = 0; i < data_call_driver.length; i++) {
                let arr_id_order = data_call_driver[i].id_delivery;
                let name_driver = data_call_driver[i].fullname;
                //Thực hiện tính tổng thời gian
                if (arr_id_order.length > 0) {
                    let sum_distance = 0;
                    arr_id_order.forEach(async (item, index) => {
                        const order_detail_id = await Order.findOne({ order_id: item });

                        const orderDetail = await OrderDetail.findOne({ _id: order_detail_id.order_detail_id });

                        const distance_split = orderDetail.distance.split(" ")[0];


                        sum_distance += Number(distance_split)
                    })


                    setTimeout(() => {
                        if (sum_distance > 0) {
                            const ob = {
                                name: name_driver,
                                sumDistance: sum_distance,
                                arrIdOrder: arr_id_order
                            }

                            arr_total_distance.push(ob)
                        }
                    }, 1000)


                } else {
                    continue;
                }
            }

            if (arr_total_distance) {
                setTimeout(() => {
                    res.status(201).json(arr_total_distance)
                }, 1000)
            } else {
                res.status(501).json('error')
            }

        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    }


}

module.exports = driverController;