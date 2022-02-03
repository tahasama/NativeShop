function errorHandler(err, req, res, next) {
  if (err.status === 401) {
    // jwt authentication error
    return res
      .status(401)
      .json({ message: "The user is not authorized...original text :" + err });
  }

  // default to 500 server error
  return res.status(500).json(err);
}

module.exports = errorHandler;
