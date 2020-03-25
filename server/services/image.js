const uuid = require("uuid/v4");


const saveImageLocally = image => {
  const extension = image.name.substr(image.name.lastIndexOf("."));
  const path = "../client/public/assets/img/cards/";
  try {
    
    const fileName = uuid();
    const file = fileName + extension;

    image.mv(path + file);
    return fileName;
  } catch (err) {
    console.log(err);
  }
};

module.exports = saveImageLocally
