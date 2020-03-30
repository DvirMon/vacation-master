
//global error handler
const errorHandler = (err, req, response, next) => {
  
  if (typeof err === "object") {
    // custom application error
    return response.status(404).json({body: error.message, message: "error"});
  }

  // default to 500 server error
  return response.status(500).json(err);
}
// enf of function

module.exports = errorHandler