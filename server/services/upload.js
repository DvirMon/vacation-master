const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid/v4");
const fs = require("fs");

const s3 = new aws.S3({
  accessKeyId: "AKIAQVJGMWHN4DAGWZFX",
  secretAccessKey: "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",
  Bucket: "vacations-image-bucket",
});

const storage = multerS3({
  s3: s3,
  bucket: "vacations-image-bucket",
  acl: "public-read",
  key: (request, file, cb) => {
    const imagePath = uuid();
    const fileName = imagePath + ".jpg";
    request.body.image = imagePath;
    cb(null, fileName);
  },
});

// allow only jpg.jpeg extension
const fileFilter = (request, file, cb) => {
  if (!file) {
    cb(new Error("error"), false);
  }
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    // resolve file
    cb(null, true);
  } else {
    // reject file
    cb(null, false);
  }
};


// init multer
const upload = multer({ storage,  fileFilter}).single('image');

module.exports = {
  upload,
};
