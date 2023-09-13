const router = require('express').Router()
const CommentBlog = require("../controllers/commentBlogController");


//Create Comment Blog
router.post('/create_comment_blog', CommentBlog.createCommentBlog)

//Read Comment Blog
router.get('/read_comment_blog/:id', CommentBlog.readCommentBlog)

//Read Comment Blog Admin
router.post('/read_comment_blog_id', CommentBlog.readCommentBlogAdmin)

//Update one field Blog
router.patch('/updateonefield_comment_blog/:id', CommentBlog.updateOneFieldCommentBlog)

module.exports = router;