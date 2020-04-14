const uuid = require("uuid/v4");
const fs = require("fs");

// function to store image locally
const saveImageLocally = (image) => {
  const path = "./uploads/";
  const extension = image.name.substr(image.name.lastIndexOf("."));
  const fileName = uuid();
  const file = fileName + extension;
  image.mv(path + file);
  return fileName;
};
// end of function

// function for upload directory
const createUploadDir = () => {
  if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
  }
};
// end of function

module.exports = {
  saveImageLocally,
  createUploadDir,
};
    