const multer = require("multer");

const upload = multer({
    storage: multer.diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
            const date_gen = Date.now()
            cb(null,date_gen + file.originalname);
        },
    }),
});

module.exports = upload;

