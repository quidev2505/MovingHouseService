const multer = require("multer");

const upload = multer({
    storage: multer.diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
            const ext = file.originalname.split('.')[1];
            cb(null, `${Date.now()}.${ext}`);
        },
    }),
});

module.exports = upload;

