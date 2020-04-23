//global error handler
const errorHandler = (err, req, response, next) => {
  
  if (err.status === 400) {
    return response.status(400).json(err.error);
  }

  if (err.status === 403) {
    return response.status(403).json("not admin");
  }

  if (err.status === 404) {
    return response.status(404).json("no content ");
  }

  if (err.status === 409) {
    response.status(409).json("username is already taken");
  }

  // default to 500 server error
  return response.status(500).json(err.message);
};
// end of function

module.exports = errorHandler;
