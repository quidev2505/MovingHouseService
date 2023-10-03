const router = require('express').Router()
const itemController = require("../controllers/itemController");

//Upload
const upload = require("../middlewares/upload");

//Create Item
router.post('/create_item', upload.single("file"), itemController.createItem)

// //Read Item
router.get('/read_item', itemController.readItem)

//Update one field Item
router.patch('/updateonefield_item/:id', itemController.updateOneFieldItem)


//Get Size of Item with name
router.get("/get_size_with_name/:name", itemController.getSizeWithName);

//Update Item
router.put('/update_item/:id', upload.single("file"), itemController.updateItem)

//Delete Item
router.delete('/delete_item/:id', itemController.deleteItem);

//View Detail Item with ID
router.get('/view_detail_item/:id', itemController.viewDetailItem)

// //View Detail blog with Title
// router.get('/view_detail_blog_title/:title', blogController.viewDetailBlogWithTitle)

module.exports = router;