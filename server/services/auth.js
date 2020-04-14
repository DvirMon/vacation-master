const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// start function to protect password
const hushPassword = async (password) => {
  const hushPassword = await bcrypt.hash(password, 10);
  return hushPassword;
};
// end of function

// function to create an access token
const setToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user.userName, role: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
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
      { sub: user.userName, role: user.isAdmin },
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
// end of function

// function to handle authorization
const authorize = (role, key) => (request, response, next) => {

  // verify if token exist
  const token = request.headers["authorization"];

  if (!token) {
    return response
      .status(401)
      .json({ message: "error", body: "You are not login" });
  } 

  try {
    // verify token 
    verified = jwt.verify(token, key);

    request.user = verified; 
    // verify admin
    if (role === 1 && request.user.role === 0) {
      return response.status(403).json({ message: "error", body: "not admin" });
    }

    next();
  } catch (err) {
    response.status(401).json({ message: "error", body: "Token has expired" });
  }
};
// end of function

module.exports = {
  hushPassword,
  setToken,
  setRefreshToken,
  authorize,
};
