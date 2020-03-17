const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hushPassword = async password => {
  const hushPassword = await bcrypt.hash(password, 10);
  return hushPassword;
};

const setToken = user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user.userID, role: user.isAdmin },
      process.env.TOKEN_SECRET,
      { expiresIn: "20m" },
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const refreshToken = user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user.userID, role: user.isAdmin },
      process.env.REFRESH_TOKEN_SECRET,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const authorize = role => (request, response, next) => {
  // verify if token exist
  
  const token = request.headers["authorization"];
  if (!token) {
    return response.status(403).json("Please Login To Continue");
  }
  
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    
    request.user = verified;
    
    if (role === 1 && request.user.role === 0) {
      return response.status(401).json("Unauthorized");
    }

    next();
  } catch (err) {
    response.status(403).json("invalid Token");
  }
};

const saveImageLocally = image => {
  const extension = image.name.substr(image.name.lastIndexOf("."));
  const fileName = uuid() + extension;
  image.mv("./upload/" + fileName);
};

module.exports = {
  hushPassword,
  setToken,
  refreshToken,
  authorize,
  saveImageLocally
};
