const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid/v4");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ID || config.s3.id,
  secretAccessKey: process.env.AWS_SECRET_KEY || config.s3.secretKey,
  Bucket: process.env.AWS_BUCKET_NAME || config.s3.bucketName,
});

// multer s3 params
 
const key = (request, file, cb) => {
  const imagePath = uuid();
  const fileName = imagePath + ".jpg";
  request.body.image = imagePath;
  cb(null, fileName);
};
 
const contentType = (request, file, cb) => {
  cb(null, file.mimetype);
}; 

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME || config.s3.bucketName,
  acl: "public-read",
  key: key, 
  contentType: contentType
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
 

const deleteImage = async (fileName) => {
 
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || config.s3.bucketName,
    Key: fileName + ".jpg",
  };  

  s3.deleteObject(params, (error, data) => {
    if (error) {
      throw new Error(error)
    }
    console.log("File has been deleted successfully");
  });
}; 



// init multer
const upload = multer({ storage, fileFilter }).single("image");

module.exports = {
  upload,
  deleteImage,
};
