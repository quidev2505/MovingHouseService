const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comment_blog_id: {
        type: Array, of: String, default: []
    },
    category: {
        type: String,
        required: true
    },
    post_date: {
        type: String,
        default: '00/00/0000'
    },
    thumbnail: {
        type: String,
        required: true
    },
    status:{
        type:Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema);