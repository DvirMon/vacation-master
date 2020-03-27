const uuid = require("uuid/v4");
const fs = require("fs");

const saveImageLocally = image => {
  const extension = image.name.substr(image.name.lastIndexOf("."));
  // const path = "../client/public/assets/img/cards/";
  const path = "./uploads/";
  try {
    const fileName = uuid();
    const file = fileName + extension;
    image.mv(path + file);
    return fileName;
  } catch (err) {
    console.log(err);
  }
};

const read = fileName => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf-8", (err, content) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(content);
    });
  });
};

const readImage = async (image) => {
  const content = await read(`./uploads/${image}.jpg`
  );
  return content;
};

module.exports = {
  saveImageLocally,
  readImage
};
