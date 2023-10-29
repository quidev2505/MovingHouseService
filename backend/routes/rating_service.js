const router = require('express').Router()
const RatingService = require("../controllers/ratingServiceController");


// //Create Comment Blog
// router.post('/create_comment_blog', CommentBlog.createCommentBlog)

//Read ALl Rating Serivice
router.get('/get_all_rating', RatingService.getRatingSerice)

//Find Rating Service Advanced
router.post('/findRatingService', RatingService.findRatingService)

// //Read Comment Blog Admin
// router.post('/read_comment_blog_id', CommentBlog.readCommentBlogAdmin)

// //Update one field Blog
// router.patch('/updateonefield_comment_blog/:id', CommentBlog.updateOneFieldCommentBlog)

module.exports = router;