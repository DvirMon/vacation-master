const errorHandler = (err, req, response, next) => {
  
  if (typeof err === "object") {
    // custom application error
    return response.status(404).json(err.message);
  }

  // default to 500 server error
  return response.status(500).json(err);
}

module.exports = errorHandler