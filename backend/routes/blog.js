const router = require('express').Router()
const blogController = require("../controllers/blogController");

//Create Blog
router.post('/create_blog', blogController.createBlog)

//Read Blog
router.get('/read_blog', blogController.readBlog)

//Update one field Blog
router.patch('/updateonefield_blog/:id', blogController.updateOneFieldBlog)

//Delete Blog
router.delete('/delete_blog/:id', blogController.deleteBlog);

//View Detail blog with ID
router.get('/view_detail_blog/:id', blogController.viewDetailBlog)

module.exports = router;