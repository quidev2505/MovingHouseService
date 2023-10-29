const router = require('express').Router()
const RatingDriver = require("../controllers/ratingDriverController");


// //Create Comment Blog
// router.post('/create_comment_blog', CommentBlog.createCommentBlog)

//Read Comment Blog
router.get('/get_rating_driver/:driver_name', RatingDriver.getRatingDriver)

//Find Rating Driver Advanced
router.post('/findRatingDriver', RatingDriver.findRatingDriver)

// //Read Comment Blog Admin
// router.post('/read_comment_blog_id', CommentBlog.readCommentBlogAdmin)

// //Update one field Blog
// router.patch('/updateonefield_comment_blog/:id', CommentBlog.updateOneFieldCommentBlog)

module.exports = router;