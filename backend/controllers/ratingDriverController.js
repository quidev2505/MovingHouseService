const RatingDriver = require('../models/RatingDriver');

const ratingDriverController = {
    //Create Comment Blog
    createCommentBlog: async (req, res) => {
        try {
            const data_input = req.body;

            //Calculate Time at the moment
            const now = new Date();
            const vietnamTime = now.toLocaleString('vi-VN');
            const time_now = vietnamTime;


            const data_comment_blog = await new CommentBlog({
                comment_content: data_input.comment_content,
                comment_time: time_now,
                fullname: data_input.fullname,
                avatar: data_input.avatar,
                blog_id: data_input.blog_id
            })



            //Save Data Blog
            const data_comment_save = await data_comment_blog.save();

            if (data_comment_save) {
                const data_blog = await Blog.findOne({ _id: data_input.blog_id });
                const arr_comment_blog_id = data_blog.comment_blog_id;
                arr_comment_blog_id.push(data_comment_save._id);

                const data_blog_update = await Blog.updateOne({ _id: data_input.blog_id }, { comment_blog_id: arr_comment_blog_id }, { new: true })

                if (data_blog_update) {
                    res.status(200).json(data_comment_save);
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
    //Read Comment Blog
    getRatingDriver: async (req, res) => {
        try {
            const driver_name = req.params.driver_name

            const data_rating_driver = await RatingDriver.find({ driver_name: driver_name });
            if (data_rating_driver) {
                res.status(201).json(data_rating_driver)
            } else {
                res.status(401).json('Error')
            }

        } catch (e) {
            console.log(e)
            res.status(501).json(e)
        }
    },

    //Read comment blog at admin page
    readCommentBlogAdmin: async (req, res) => {
        try {
            const arr_id = req.body;

            const arr_data_return = []
            for (const item of arr_id) {
                const id_comment_blog = item;
                const data_comment = await CommentBlog.find({ _id: id_comment_blog })

                const object_data_return = {
                    id: data_comment[0]._id,
                    fullname: data_comment[0].fullname,
                    avatar: data_comment[0].avatar,
                    comment_content: data_comment[0].comment_content,
                    comment_time: data_comment[0].comment_time,
                    status: data_comment[0].status
                }

                arr_data_return.push(object_data_return)
            }

            if (arr_data_return) {
                res.status(201).json(arr_data_return)
            } else {
                res.status(501).json('Lỗi')

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

    //Update one field blog
    updateOneFieldCommentBlog: async (req, res) => {
        try {
            const id_comment_blog = req.params.id;
            const dataUpdateOne = await CommentBlog.updateOne({ _id: id_comment_blog }, req.body, { new: true });
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
    //Tìm kiếm đánh giá tài xế
    findRatingDriver: async (req, res) => {
        try {
            const { fullnameDriver, fullnameCustomer } = req.body;

            //Gọi dữ liệu đánh giá tài xế
            const call_api_rating_driver = await RatingDriver.find();
            const data_rating_driver = call_api_rating_driver;

            const data_all = data_rating_driver.map((item, index) => {
                return {
                    rating_date: item.rating_date,
                    star: item.star,
                    comment: item.comment,
                    customer_name: item.customer_name,
                    driver_name: item.driver_name
                }
            })


            //Khu vực xử lý dữ liệu nhập vào
            let new_arr = data_all.filter((item) => {
                // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
                let word_Change_VN = ratingDriverController.removeVietnameseTones(fullnameDriver != '' ? item.driver_name : fullnameCustomer != '' ? item.customer_name : '');
                let word_search = ratingDriverController.removeVietnameseTones(fullnameDriver || fullnameCustomer);
                // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
                let search = fullnameDriver || fullnameCustomer

                return search.toLowerCase() === ""
                    ? item
                    : word_Change_VN.toLowerCase().includes(word_search.toLowerCase());
            });

            setTimeout(() => {
                if (new_arr) {
                    res.status(201).json(new_arr);
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

module.exports = ratingDriverController;