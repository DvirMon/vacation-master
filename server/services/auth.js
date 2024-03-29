const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");


// function to protect password
const setPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
// end of function

const comparePassword = async (password) => {

}

const decodeToken = (token) => {
  console.log(token)
  return jwt_decode(token)
}

// function to create an access token
const setToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user.uuid, role: user.isAdmin },
      config.jwt.actKey,
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
// end of function 

// function to create a refresh token
const setRefreshToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user.uuid, role: user.isAdmin },
      config.jwt.refKey,
      { expiresIn: "3d" },
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};
// end of function

// function to handle authorization
const authorize = (role, key) => (request, response, next) => {
  // verify if token exist
  const token = request.headers["authorization"];


  if (!token) {
    return response.status(401).json("You are not login");
  }

  try {
    // verify token
    const payload = jwt.verify(token, key);
    request.user = payload;

    // verify admin
    if (role === 1 && request.user.role === 0) {
      next({ status: 403 });
      return;
    }

    next();
  } catch (err) {
    response.status(401).json("token has expired");
  }
};
// end of function

module.exports = {
  setPassword,
  setToken,
  setRefreshToken,
  authorize,
  decodeToken
};
