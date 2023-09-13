const mongoose = require('mongoose')

const commentBlogSchema = new mongoose.Schema({
    comment_content: {
        type: String,
        required: true
    },
    comment_time: {
        type:String,
        default: null,
        required:true
    },
    customer_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    blog_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('CommentBlog', commentBlogSchema);