const router = require('express').Router()
const blogController = require("../controllers/blogController");

//Upload
const upload = require("../middlewares/upload");

router.post('/create_blog', upload.single("file"), blogController.createBlog)

//Read Blog
router.get('/read_blog', blogController.readBlog)

//Update one field Blog
router.patch('/updateonefield_blog/:id', blogController.updateOneFieldBlog)

//Update Blog
router.put('/update_blog/:id', upload.single("file") ,blogController.updateBlog)

//Delete Blog
router.delete('/delete_blog/:id', blogController.deleteBlog);

//View Detail blog with ID
router.get('/view_detail_blog/:id', blogController.viewDetailBlog)

//View Detail blog with Title
router.get('/view_detail_blog_title/:title', blogController.viewDetailBlogWithTitle)

module.exports = router;