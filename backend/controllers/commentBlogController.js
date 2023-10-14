const CommentBlog = require('../models/CommentBlog');
const Blog = require('../models/Blog');



const commentBlogController = {
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
    readCommentBlog: async (req, res) => {
        try {
            const id_blog = req.params.id;

            const data_comment_blog = await CommentBlog.find({ blog_id: id_blog }).sort({ createdAt: 1 })


            const arr_data_return = []
            for (const item of data_comment_blog) {
                const object_data_return = {
                    fullname: item.fullname,
                    avatar: item.avatar,
                    comment_content: item.comment_content,
                    comment_time: item.comment_time,
                    status: item.status,
                    createdAt: item.createdAt
                }

                arr_data_return.push(object_data_return)
            }

            if (arr_data_return.length > 0) {
                res.status(200).json(arr_data_return)
            } else {
                res.status(501).json('Error');
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
    }


}

module.exports = commentBlogController;