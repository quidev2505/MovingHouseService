const Customer = require('../models/Customer');
const User = require('../models/User')
const Order = require('../models/Order')
const CommentBlog = require('../models/CommentBlog')

const fs = require('fs');

const customerController = {
    //Get All Customer
    getAllCustomer: async (req, res) => {
        try {
            let customer = await Customer.find();
            if (customer) {
                res.status(200).json(customer)
            } else {
                res.status(404).json('Error')
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Get Info User With Customer Name
    getInfoUserWithCustomerName: async (req, res) => {
        try {
            let customer_name = req.params.customer_name;

            const data_user = await User.findOne({ fullname: customer_name })

            if (data_user) {
                res.status(200).json(data_user)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Get Info Customer With Fullname
    getCustomerWithFullName: async (req, res) => {
        try {
            let fullname_customer = req.params.fullname;

            const data_customer = await Customer.findOne({ fullname: fullname_customer })

            if (data_customer) {
                res.status(200).json(data_customer)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Get Info Customer With ID Customer
    getCustomerWithIDCustomer: async (req, res) => {
        try {
            let id_customer = req.params.id

            const data_customer = await Customer.findOne({ _id: id_customer })

            if (data_customer) {
                res.status(200).json(data_customer)
            } else {
                res.status(500).json('Error');
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Get arr_customer_name
    getArrFullName: async (req, res) => {
        try {
            const arr_id_customer = req.body;
            const arr_customer_name = await Promise.all(arr_id_customer.map(async (item, index) => {
                const data_result = await Customer.findOne({ _id: item })
                return data_result.fullname
            }))

            if (arr_customer_name) {
                res.status(201).json(arr_customer_name)
            } else {
                res.status(501).json('Error')
            }
        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },
    //Get Info Customer
    getCustomer: async (req, res) => {
        try {
            const data_user = await User.findOne({ _id: req.params.id })

            const data_customer = await Customer.findOne({ fullname: data_user.fullname });

            if (data_customer) {
                res.status(200).json(data_customer)
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
    //Tìm kiếm khách hàng
    findCustomerAdvaned: async (req, res) => {
        try {
            const { phonenumber, fullname, address } = req.body;

            //Gọi dữ liệu User
            const call_api_user = await User.find();
            const data_user = call_api_user;

            //Gọi dữ liệu Customer
            const call_api_customer = await Customer.find();
            const data_customer = call_api_customer;


            const data_all = data_user.map((item, index) => {
                return {
                    fullname: item.fullname,
                    email: item.email,
                    phonenumber: item.phonenumber,
                    address: data_customer[index].address,
                    avatar: data_customer[index].avatar,
                    gender: data_customer[index].gender,
                    customer_id: data_customer[index]._id,
                }
            })


            //Khu vực xử lý dữ liệu nhập vào
            let new_arr = data_all.filter((item) => {
    
                    // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
                    let word_Change_VN = customerController.removeVietnameseTones(fullname != '' ? item.fullname : phonenumber != '' ? item.phonenumber : address != '' ? item?.address : '');
                    let word_search = customerController.removeVietnameseTones(fullname || phonenumber || address);
                    // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
                    let search = fullname || phonenumber || address

                    return search.toLowerCase() === ""
                        ? item
                        : word_Change_VN.toLowerCase().includes(word_search.toLowerCase());
                

            });

            //Dùng vòng lặp lướt qua các đơn hàng đã thanh toán
            var arr_final = [] //Kết quả hiển thị
            new_arr.forEach(async (item, index) => {
                //Khu vực cho thanh toán
                const dataOrder = await Order.find({ customer_id: item.customer_id })

                let sumPayment = 0;//Tổng thanh toán
                let sumOrderComplete = 0;//Số đơn giao thành công
                let sumOrderCancel = 0;//Số đơn đã hủy

                dataOrder.forEach((item1, indx) => {
                    //Tổng thanh toán
                    if (item1.status === "Đã hoàn thành") {
                        sumOrderComplete++;
                        sumPayment += item1.totalOrder
                    } else if (item1.status === "Đã hủy") {
                        sumOrderCancel++;
                    }
                })

                item.totalPayment = sumPayment
                item.totalOrderComplete = sumOrderComplete;
                item.totalOrderCancel = sumOrderCancel;

                //Khu vực cho bình luận
                const dataCommentBlog = await CommentBlog.find({ fullname: item.fullname })
                let sumCommentBlog = 0;//Tổng số lượt bình luận

                dataCommentBlog.forEach((item, index) => {
                    sumCommentBlog++;
                })

                item.totalCommentBlog = sumCommentBlog


                arr_final.push(item)
            })

            setTimeout(() => {
                if (arr_final) {
                    res.status(201).json(arr_final);
                } else {
                    res.status(501).json('Error');
                }
            }, 500);


        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    }

}

module.exports = customerController;