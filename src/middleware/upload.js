const multer = require("multer");
var path = require("path");

const uploadMiddleware = (fieldName, destination = "") => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/imgs`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });
  return upload.single(fieldName);
};

module.exports = uploadMiddleware;
