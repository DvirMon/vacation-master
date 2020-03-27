const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// start function to protect password
const hushPassword = async password => {
  const hushPassword = await bcrypt.hash(password, 10);
  return hushPassword;
};
// end of function

// function to create first access token
const setToken = user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user.userName, role: user.isAdmin },
      process.env.TOKEN_SECRET,
      { expiresIn: "15m" },
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


// function to create the refresh token
const refreshToken = user => {
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

const authorize = role => (request, response, next) => {

  // verify if token exist
  const token = request.headers["authorization"];
  if (!token) {
    return response.status(401).send("Please Login To Continue");
  }
  
  try {
    // verify token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    
    request.user = verified;
    
    // verify admin
    if (role === 1 && request.user.role === 0) {
      return response.status(403).send("not admin");
    }
     
    next();
  } catch (err) {
    response.status(401).send("Token has expired");
  }
};
// end of function

module.exports = {
  hushPassword,
  setToken,
  refreshToken,
  authorize,
};
