const CommentBlog = require('../models/CommentBlog');
const Blog = require('../models/Blog');



const commentBlogController = {
    //Create Comment Blog
    createCommentBlog: async (req, res) => {
        try {
            const data_input = req.body;
            console.log(data_input)

            //Calculate Time at the moment
            const now = new Date();
            const vietnamTime = now.toLocaleString('vi-VN');
            const time_now = vietnamTime.split(' ').join('-')


            const data_comment_blog = await new CommentBlog({
                comment_content: data_input.comment_content,
                comment_time: time_now,
                customer_id: data_input.customer_id,
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
            const data_from_db = await CommentBlog.find();

            data_from_db.forEach(async(item, index)=>{
                const customer = await item.populate('customer_id')
                const data_object_comment = {
                    fullname: customer.customer_id.fullname,
                    avatar: customer.customer_id.avatar,
                    comment_content: item.comment_content,
                    comment_time: item.comment_time
                }
            
                return [data_object_comment]
            })

            console.log(arr_db)

            // if (data_from_db) {
                
            //     res.status(201).json(data_from_db)
            // } else {
            //     res.status(501).json('Error');
            // }
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
    updateOneFieldBlog: async (req, res) => {
        try {
            const id_blog = req.params.id;
            const dataUpdateOne = await Blog.updateOne({ _id: id_blog }, req.body, { new: true });
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