const router = require('express').Router()
const CommentBlog = require("../controllers/commentBlogController");


//Create Comment Blog
router.post('/create_comment_blog', CommentBlog.createCommentBlog)

//Create Comment Blog
router.get('/read_comment_blog', CommentBlog.readCommentBlog)

module.exports = router;